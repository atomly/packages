# atomly

[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

---

## TODOs

Change name of repo to @atomly/sdk-monorepo.

---

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Packages](#packages)
- [Installation](#installation)
- [Commiting code changes](#commiting-code-changes)
- [Versioning a package](#versioning-a-package)
- [Creating a new package](#creating-a-new-package)
- [Add a dependency](#add-a-dependency)
- [Building](#building)
- [EOL](#eol)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Packages

<!-- START custom generated Lerna Packages please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN `npm run readme` TO UPDATE -->

- [@atomly/billing-sdk](https://github.com/atomly/atomly/tree/master/packages/billing-sdk "@atomly/billing-sdk package homepage")
- [@atomly/config-loader](https://github.com/atomly/atomly/tree/master/packages/config-loader "@atomly/config-loader package homepage")
- [@atomly/data-structures-sdk](https://github.com/atomly/atomly/tree/master/packages/data-structures-sdk "@atomly/data-structures-sdk package homepage")
- [@atomly/dataloader-sdk](https://github.com/atomly/atomly/tree/master/packages/dataloader-sdk "@atomly/dataloader-sdk package homepage")
- [@atomly/hubful](https://github.com/atomly/atomly/tree/master/packages/hubful "@atomly/hubful package homepage")
- [@atomly/mongoose-sdk](https://github.com/atomly/atomly/tree/master/packages/mongoose-sdk "@atomly/mongoose-sdk package homepage")
- [@atomly/typeorm-entity-semver-manager](https://github.com/atomly/atomly/tree/master/packages/typeorm-entity-semver-manager "@atomly/typeorm-entity-semver-manager package homepage")
- [@atomly/typeorm-sdk](https://github.com/atomly/atomly/tree/master/packages/typeorm-sdk "@atomly/typeorm-sdk package homepage")

<!-- END custom generated Lerna Packages please keep comment here to allow auto update -->

## Installation

```cli
npm install -g lerna commitizen
git clone git@github.com:atomly/atomly.git
npm install
npm run bootstrap
```

## Commiting code changes

This monorepo uses Conventional Changelog specification for commit messages which will be used by Lerna for versioning, and for generating/creating `README.md` files.

In order to commit changes you **must** use the command `git cz` instead of `git commit` to use the `commitizen` command line utility under the hood.

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

See [@lerna/add](https://github.com/lerna/lerna/tree/master/commands/add) for more options.

## Building

To build all the packages `lerna run build`. To build an specify package `lerna run build --scope=@atomly/<package-name>`.

See [`@lerna/run`](https://github.com/lerna/lerna/tree/master/commands/run) for more options.

## EOL

This monorepo uses `LF` line endings **only**. If your local copy of this repository is using `CRLF` line endings, follow this answer:

[Force LF eol in git repo and working copy](https://stackoverflow.com/a/42135910/10246377).
