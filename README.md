# beast-api

[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

## Installation

```cli
npm install -g lerna commitizen
git clone git@github.com:beast-app/beast-api.git
npm install
npm run bootstrap
```

## Commiting code changes

This repo use Conventional Changelog specification for commit messages which will be used by Lerna for versioning and for generating/creating README.md files.

In order to commit changes you should use the command `npm run commit` instead of `git commit`.

## Versioning a package

Use the command `lerna version`.

## Creating a new package

Before creating a new package using lerna you need to set up git:

```cli
git config user.name <your-name>
git config user.email <your-email>
```

Then `lerna create <package-name>`. See [@lerna/create](https://github.com/lerna/lerna/tree/master/commands/create) for more options.

## Add a dependency

See [@lerna/add](https://github.com/lerna/lerna/tree/master/commands/add) for more options

## Building

To build all the packages `lerna run build`. To build an specify package `lerna run build --scope=@beast/<package-name>`.

See [`@lerna/run`](https://github.com/lerna/lerna/tree/master/commands/run) for more options.
