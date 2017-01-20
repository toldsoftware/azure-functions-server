# Azure Functions Server

[![npm (scoped)](https://img.shields.io/npm/v/@told/azure-functions-server.svg)](https://www.npmjs.com/package/@told/azure-functions-server)
[![Build Status](https://travis-ci.org/toldsoftware/azure-functions-server.svg?branch=master)](https://travis-ci.org/toldsoftware/azure-functions-server)
[![Coverage Status](https://coveralls.io/repos/github/toldsoftware/azure-functions-server/badge.svg)](https://coveralls.io/github/toldsoftware/azure-functions-server)

Cli tool and Base Code for Node Azure Functions with Typescript

## Usage

```bash
npm install @told/azure-functions-server --save
// Add this to package.json>scripts "afs": ".\\node_modules\\.bin\\afs -w",
npm run afs
```

## Source Project Structure

- src-server contains azure function entrances
    - example-function-get-blob.ts
        - An example of generating a random uuid for a user and giving them a azure storage blob with sas write access
    - example-function-resource.ts
        - An example of serving files from the deployment/resources folder
        - __dirname is relative to the azure function runtime path (not the original source file)
- src contains common code for app models and business logic
    - app models and business logic can be tested with karma + jasmine
    - app models and business logic can be used to do client side processing (that can be verified by server-side processing if needed)
- resources
    - contains the BOILERPLATE for a azure function
        - test.js is used for local testing which simulates an azure function call
        - index.js is the entrance for azure which calls build.js
        - build.js (generated by webpack in the cli)
        - build.source.js is the source file used for webpack to generate the deployment/FUNCTION/build.js
- .deployment directs azure git deployment to use the "deployment" folder as root
- (generated) deployment contains the server-side deployment code
    - a clone of lib code
    - a clone of package.json with dev-dependencies removed
    - a generated function entry point for each entry point in src-server


## Webpack for Node Azure Functions

The cli tool manually calls webpack after moving everything into the deployment folder. 

See src-cli/run-webpack.ts to see actual call in typescript.

At time of writing, the configuration settings are:

```js
    entry: {
        // './EXAMPLE.webpack.js': './EXAMPLE.js',
    },
    output: {
        path: './',
        filename: '[name]'
    },
    target: 'node',
    node: {
        __filename: false,
        __dirname: false,
    }
```

### Webpack Performance

- At time of testing, npm references were causing the cold start for a node function with large node_modules to sometimes exceed 5 minutes (often over 2 minutes).
- Using webpack to package all node_modules references into a single file, reduced the cold start to around 10 seconds. (Not great, but acceptable.)

![Webpack Performance](https://toldazureblobaccesstest.blob.core.windows.net/test/WebpackPerformance2.png)