# Beast Backend (WIP)

## TODO (sorted by highest to lowest priorities)

- Remove dependency of a `.env.test` file by adding more variables to `.env` and configuring starting scripts for a testing environment.
- Add Jest overview section.
- Add Entities & Validation section.
- Mac OS shell scripts.
- Mac OS global dependencies installation requirements (Prisma 2 only - might be a bug).

---

## Installation

### Requirements

- Have Node.js installed.
- Have Docker installed. If you can't install Docker (e.g. Windows 10 Home Edition), you can fall back to a Vagrant machine image then install Docker inside the guest OS.
- Have NPM installed.
- Git Bash CLI recommended.

### Installation: TL;DR

1. Git clone this repository.
2. Install all of the dependencies found in the `package.json`.
3. Run `docker-compose up` to start and run the containers.
    - [Detailed steps for the PostgreSQL Docker container here.](https://github.com/beast-app/beast-backend/blob/master/database/README.md)
    - [Detailed steps for the Redis Docker container here.](https://github.com/beast-app/beast-backend/blob/master/redis/README.md)
4. Set up the development environmental variables.
    - [More details in the environmental variables.](#Environmental-Variables-File-Template)
5. Synchronize the database with our Entities by executing the `synchronize_typeorm.sh` script.
6. Introspect the database then generate the Prisma schema and client by executing the `generate_prisma_client.sh` script.
7. Once the Docker containers are running, the database is synchronized and introspected, and the Prisma client has been successfuly generated, it is now safe to start the server by running `npm start`.

---

## Docker Compose

[Source](https://docs.docker.com/compose/ "Permalink to Overview of Docker Compose | Docker Documentation")

## Overview of Docker Compose | Docker Documentation

Compose is a tool for defining and running multi-container Docker applications. With Compose, we use a YAML file to configure your application's services. Then, with a single command, we create and start all the services from our configuration.

Using Compose is basically a three-step process:

1. We define our app's environment with a `Dockerfile` so it can be reproduced anywhere.

2. We define the services that make up our app in `docker-compose.yml` so they can be run together in an isolated environment.

3. Run `docker-compose up` and Compose starts and runs our entire app.

Our `docker-compose.yml` looks like this:

```yml
version: '3'
services:
  redis:
    image: redis
    ports:
      - "${REDIS_CONTAINER_PORT}"
    # Setting the server password on start.
    command: redis-server --requirepass ${REDIS_PASSWORD}
    networks:
      - webnet
  db:
    image: postgres:alpine
    ports:
      - "${DB_CONTAINER_PORT}"
    # Runs every shell script found in this directory by using volumes.
    volumes:
      - ./database:/docker-entrypoint-initdb.d
    networks:
      - webnet
    environment:
      POSTGRES_USER: ${TYPEORM_USERNAME}
      POSTGRES_PASSWORD: ${TYPEORM_PASSWORD}
      POSTGRES_MULTIPLE_DATABASES: ${DB_DATABASES}
networks:
  webnet:
```

Where `redis`, and `db` are our two containers hosting our Redis server and our PostgreSQL database respectively.

- Our Redis server is based on the `redis` Docker image, started with a required password `REDIS_PASSWORD` and on port `REDIS_CONTAINER_PORT` on the `webnet` network.
- Our PostgreSQL database is based on the `postgres:alpine` image, hosted on port `DB_CONTAINER_PORT`, on the `webnet` network. It also mounts a volume to create multiple databases (e.g. for testing and development environments) when the container is started, by mounting a volume, after the entrypoint calls `initdb` to create the default `postgres` user and database, it will run any `*.sql` files and source any `*.sh` scripts found in the `database` to do further initialization before starting the service, in this case, the script found in `database` will create the databases declared in `DB_DATABASES`, e.g. `development,test` (in that format separated by commas without empty spaces).
- The `webnet` network will fallback to the default network.
- **Important:** the variables shown as template literals, e.g. `${REDIS_CONTAINER_PORT}`, are all derived from the `.env` variable, [more information here](https://docs.docker.com/compose/environment-variables/#the-env-file). The environmental file template is structured in a "plug and play" way for our `docker-compose` YAML file to work.

Compose has commands for managing the whole lifecycle of your application:

- Start, stop, and rebuild services.
- View the status of running services.
- Stream the log output of running services.
- Run a one-off command on a service.

### Automated testing environments

An important part of any Continuous Deployment or Continuous Integration process is the automated test suite. Automated end-to-end testing requires an environment in which to run tests. Compose provides a convenient way to create and destroy isolated testing environments for your test suite. By defining the full environment in a Compose file, we can create and destroy these environments in just a few commands:

```linux
docker-compose up -d
npm run test
docker-compose down
```

---

## Scripts & Workflow

### Scripts & Workflow: TL;DR

- If the database schema changes when changing our TypeORM entities (entity directory), execute the `generate_prisma_client.sh` shell script to update our Prisma schema and client.
- Note that for this to work, TypeORM must have synchronized the database before re-generating the client. If for some reason it does not work, execute the `synchronize_typeorm.sh` script.
- If our server's GraphQL schema (`schema.graphql`) changes, we need to regenerate our `GQL` namespace which contains the type definitions for our GraphQL queries, mutations, subscriptions, etc. To do this, execute the `generate_types.sh` shell script to update our Prisma schema and client.

### Overview

There are certain scripts that must be ran after updating certain files. Some of these files are related to the database architecture, and the rest are related to our GraphQL server. There is no need to run any special script when making changes to our server, but when we make changes to our database, it is important to regenerate our GraphQL schema and types so that it matches our database tables/models.

### The Workflow

The database is managed by two layers.

- The first layer is the TypeORM layer, which iterates the database based on the TypeORM entities for each table which also contains the columns and relations to other tables. Not only it manages the database architecture, it also takes care of generating migrations and subscribers separate from the ones generated by Prisma 2.

- The second layer is the Prisma 2 layer. Prisma 2 introspects the databased (managed by TypeORM) and based on the introspection it generates a Prisma schema. Then, based on how the schema looks, a Prisma client will be generated. The prisma client is capable of serving as a context for our resolvers, capable of fetching or mutating data, as well as subscribing to events in a very efficient way without the need of writing data loaders for all of our entities.

### Scripts

Thanks to the TypeORM configuration settings, it is therefore only necessary to recreate the Prisma schema after TypeORM makes changes to our database schema.

If our GraphQL schema is changed, then we need to regenerate our `GQL` namespace which contains the typings for our queries, automatically generated using the `gql2ts` API.

### TypeORM Synchronize

[Source.](https://github.com/typeorm/typeorm/blob/master/docs/connection-options.md)

> Indicates if database schema should be auto created on every application launch. Be careful with this option and don't use this in production - otherwise you can lose production data. This option is useful during debug and development. As an alternative to it, you can use CLI and run schema:sync command, or execute the `synchronize_typeorm.sh` script located inside the `scripts` directory.

Whenever this option is set to `true` inside the `ormconfig.js` file, our database schema will be recreated after every change, thanks to `nodemon` detecting any of the changes and restarting the server.

### Prisma Generate

[Source.](https://www.prisma.io/docs/prisma-cli-and-configuration/cli-command-reference/prisma-generate-xcv2/)

> In order to use Prisma Client JS in your application, you must install the @prisma/client package in your application:
> ```npm install @prisma/client```
> The @prisma/client package itself is a facade package (basically a stub) that doesn't contain any functional code, such as types or the Prisma Client JS runtime. When installing the @prisma/client package, its postinstall hook is being executed to invoke the prisma2 generate command and generate the actual Prisma Client JS code into the facade package at node_modules/@prisma/client.
> This means the prisma2 CLI needs to be available as well. It is typically installed as a development dependency:
> ```npm install prisma2 --save-dev```
> Note that you'll need to re-execute prisma2 generate whenever you make changes to your Prisma schema (or perform the changes while are you're running Prisma's development mode.

In short, everytime there are changes to our TypeORM database schema, we need to introspect the database with Prisma 2 to update our Prisma schema, then regenerate our client.

To do this, the script `generate_prisma_client.sh` found in the `scripts` directory is of big help. Simply running `source generate_prisma.sh` in our root folder will automatically introspect then regenerate our Prisma schema and client.

### GrahpQL Schema and Types

To generate GraphQL types base on our schema, if the server's GraphQL schema is changed, execute the `generate_types.sh` shell script to update the `GQL` namespace containing the type definitions of our queries, mutations, subscriptions, etc.

Changes to our actual GraphQL schema will have to be done manually. **It's important to regenerate our types after we change our server's GraphQL schema**. This decision was made with the reasoning that it's important to invest detailed attention into the server's GrapQL schema. This schema is found in the `schema.graphql` file inside the `src/schema` diretory.

---

## Stack

- PostgreSQL relational database setup in the `.env` file. The database is synchronized by `TypeORM` and introspected by `Prisma` to improve our GraphQL developer experience.
- Redis data structure store is perfect for storing persistent sessions for our users. We're using the `ioredis` library to generate our Redis client in our server, finally, the Redis client is passed to `graphql-yoga` express based server for the sessions.

---

## Environmental Variables File Template

The following configuration is necessary to run the application. The following env. variables are working examples, make sure to fill them with the valid host IP and port where your local Docker containers are hosted, as well as the other information. It's possible to add cloud-hosted services as well.

```.env
# Node #
NODE_PATH=./
NODE_ENV=development
TS_NODE_FILES=true

# TypeORM #
TYPEORM_CONNECTION=postgres
TYPEORM_HOST=192.168.99.101
TYPEORM_PORT=5432
TYPEORM_USERNAME=postgres
TYPEORM_PASSWORD=password
TYPEORM_DATABASE=development

# Redis #
REDIS_PORT=6379
REDIS_HOST=192.168.99.101
REDIS_FAMILY=4 # 4 (IPv4) or 6 (IPv6)
REDIS_PASSWORD=password
REDIS_DB=0

# Express Session #
SESSION_SECRET_KEY=GUaibfrDISUE37d11Je5PWl4vCeB5nHB

# Prisma #
# postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=SCHEMA
POSTGRESQL_URL=postgresql://postgres:password@192.168.99.101:5432/development

# Docker Compose #
REDIS_CONTAINER_PORT=6379:6379
DB_CONTAINER_PORT=5432:5432
DB_DATABASES=development,test
```
