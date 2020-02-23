# Beast Backend (WIP)

## TODO (sorted by highest to lowest priorities)

- Add `throw new Error(...)` utility function on `development` and `test` environments, or default return values on `production` environments.
- Remove dependency of a `.env.test` file by adding more variables to `.env` and configuring starting scripts for a testing environment.
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

### Troubleshooting

- If you're getting `Not able to execute a .sh file: /bin/bash^M: bad interpreter` errors on Windows when Docker Compose tries to run the containers, make sure the respective `.sh` scripts have LF line endings, [more here](https://askubuntu.com/questions/304999/not-able-to-execute-a-sh-file-bin-bashm-bad-interpreter).

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

[Source](https://github.com/typeorm/typeorm/blob/master/docs/connection-options.md "TypeORM Connection Options")

> Indicates if database schema should be auto created on every application launch. Be careful with this option and don't use this in production - otherwise you can lose production data. This option is useful during debug and development. As an alternative to it, you can use CLI and run schema:sync command, or execute the `synchronize_typeorm.sh` script located inside the `scripts` directory.

Whenever this option is set to `true` inside the `ormconfig.js` file, our database schema will be recreated after every change, thanks to `nodemon` detecting any of the changes and restarting the server.

### Prisma Generate

[Source](https://www.prisma.io/docs/prisma-cli-and-configuration/cli-command-reference/prisma-generate-xcv2/ "Prisma CLI & Configuration - CLI Command Reference - prisma generate")

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

## Jest and our Testing Environment

Ideally we want to have all of our queries covered with end to end testing as well as edge cases in consideration. To perform the tests, we're using Facebook's Jest library as a testing framework due to their easy-to-use and approachable API.

**To run tests**, ensure that **at least the `test` database must be running on a local Docker container**. It is not required to have the server running to perform the tests. For example, to execute our unit tests we can easily run the following commands:

```linux
docker-compose up
npx jest
docker-compose down
```

**It is also possible to simply let Jest run on watch mode**. Our `test` NPM script found inside the `package.json` is already configured in such a way that would achieve this. To do so, run the following commands:

```linux
docker-compose up
npm run test
```

### Jest Config, globalSetup, and globalTeardown

Our Jest config is setup to work in a TypeScript framework, to work in a Node.js environment, to run a `globalSetup` file before all tests, a `globalTeardown` file after all tests, and finally to parse our module aliases to match the configuration found in `tsconfig.json` for our imports to work.

Our `globalSetup` sets up our test environmental variables, by calling `setupConfig` with our `.env` file, and `globalTeardown` gracefully exits our tests.

### Test Utils, Fixtures, and Test Files folder strucure

Inside our `tests/utils` directory, we have a few cool things to help us perform end to end tests. The most important function is the `gqlCall` function, which builds our schema then mocks our server by executing our queries and executing our resolvers. It takes 1 variable (in practice, 2 variables), named `source` (e.g. the GraphQL query sent from a client) and `variableValues` (the query arguments, if any). It is encouraged to check this directory out.

Our `tests/fixtures` folder is intended to store fixtures to quickly create models before tests, as if to seed the database, among other operations. The purpose of a test fixture is to ensure that there is a well known and fixed environment in which tests are run so that results are repeatable. Some people call this the test context.

Examples of fixtures:

- Loading a database with a specific, known set of data.
- Preparation of input data and set-up/creation of fake or mock objects.

Our unit tests found in the `tests` directory are structured in a way to match our schema found in the `schema` diretory, so that we can easily find the respective unit or end to end tests for our resolvers & queries.

---

## Entities and Validation

[Source 1](https://github.com/rmolinamir/typescript-cheatsheet/blob/master/README.md#decorators "TypeScript Cheatsheet - Decorators")
[Source 2](https://levelup.gitconnected.com/complete-guide-to-using-typeorm-and-typescript-for-data-persistence-in-node-js-module-bfce169959d9 "Complete guide to using TypeORM and TypeScript for data persistence in Node.js module")
[Source 3](https://github.com/typestack/class-validator "Validation made easy using TypeScript decorators.")


We use a combination of `typeorm` and `class-validators` to design the architecture our database, while simultaneously validating the tables and columns by taking advantage of TypeScript decorators.

In TypeScript, a decorator is a special kind of declaration that can be attached to a class declaration, method, accessor, property, or parameter. Decorators use the form `@expression` syntax, where `expression` must evaluate to a function that will be called at runtime with information about the decorated declaration.

In **TypeORM** an Entity maps between a TypeScript class and a database table. You create an Entity by adding the `@Entity()` annotation at the top of the class definition, and then for each field in the class adding a `@Column` (or similar) annotation. Those annotations give TypeORM the information necessary to set up the database table.

Due to the way Entities are applied and the nature of decorators in TypeScript, **`class-validator`** allows the use of decorator based validation to validate the fields (columns) of our Entities (tables) at the time of creation. If a validation error happens, then a validation error will be thrown at runtime. Here's a simple example of mixing `typeorm` and `class-validator` as well as a custom validator in a `constraints.ts` file:

```ts
//
// User.ts
//

// Libraries
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
} from 'typeorm';
import { IsEmail } from 'class-validator';

// Dependencies
import { IsEmailAlreadyTaken } from './constraints';

@Entity("users")
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @IsEmail()
  @IsEmailAlreadyTaken({ message: 'email already taken '})
  @Column('varchar', { length: 255, unique: true })
  email: string;

  @Column('text')
  password: string;
}

...

//
// constraints.ts
//

// Libraries
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";
import { User } from ".";

@ValidatorConstraint({ async: true })
export class IsEmailAlreadyTakenConstraint implements ValidatorConstraintInterface {
  async validate(email: string): Promise<boolean> {
    const user = await User.findOne({ where: {
      email,
    }})
    if (user) {
      return false;
    }
    return true;
  }
}

export function IsEmailAlreadyTaken(validationOptions?: ValidationOptions) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function (object: Record<string, any>, propertyName: string): void {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsEmailAlreadyTakenConstraint,
    });
  };
}
```

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
TYPEORM_HOST=localhost
TYPEORM_PORT=5432
TYPEORM_USERNAME=postgres
TYPEORM_PASSWORD=password
TYPEORM_DATABASE=development

# Redis #
REDIS_PORT=6379
REDIS_HOST=localhost
REDIS_FAMILY=4 # 4 (IPv4) or 6 (IPv6)
REDIS_PASSWORD=password
REDIS_DB=0

# Express Session #
SESSION_SECRET_KEY=GUaibfrDISUE37d11Je5PWl4vCeB5nHB

# Prisma #
# postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=SCHEMA
POSTGRESQL_URL=postgresql://postgres:password@localhost:5432/development

# Docker Compose #
REDIS_CONTAINER_PORT=6379:6379
DB_CONTAINER_PORT=5432:5432
DB_DATABASES=development,test
```
