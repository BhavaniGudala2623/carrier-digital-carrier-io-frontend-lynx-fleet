# Carrier.io LYNX Fleet web application front end

## Development

### How to resolve dependencies

Authorize in Carrier AWS account (Please use IoT_Carrier_IO_Dev as we store secrets there) and then run following commands:

1. Authorize in AWS Codeartifact

```console
yarn rc
```

2. Install packages

```console
yarn
```

### How to run

```console
yarn start
```

### How to build

```console
yarn build
```

### Running tests

The project has configuration for unit tests and e2e tests. You can run then using commands

```console
yarn test:unit
```

```console
yarn test:e2e
```

Or just

```console
yarn test
```

It will run unit tests by default (subject to change)

## Commit process

Before every commit all staged files will be verified by linter and commit will be aborted in case when errors found. So any new code should be error-free.

## Configuration

The application is built using `bulletproof-react` architecture as reference. https://github.com/alan2207/bulletproof-react

## Development

To disable React StricMode set REACT_APP_STRICT_MODE=false in the .env.local

## Cypress

To activate Cypress we need to update package.json and uncomment cypress-tests in /circleci/config.yml

```
{
   "scripts": {
    ...
    "test:e2e": "cypress run --spec 'cypress/e2e/*.feature'",
    "test:e2e:interactive": "cypress run --headed --spec 'cypress/e2e/*.feature'",
  },
  "devDependencies": {
    ...
    "cypress": "^11.2.0",
    "cypress-cucumber-preprocessor": "^4.3.1"
  },
  "cypress-cucumber-preprocessor": {
    "nonGlobalStepDefinitions": true,
    "step_definitions": "./cypress/e2e"
  },
}

```
