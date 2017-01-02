# Azure Functions Server

[![npm (scoped)](https://img.shields.io/npm/v/@told/azure-functions-server.svg)](https://www.npmjs.com/package/@told/azure-functions-server)
[![Build Status](https://travis-ci.org/toldsoftware/azure-functions-server.svg?branch=master)](https://travis-ci.org/toldsoftware/azure-functions-server)
[![Coverage Status](https://coveralls.io/repos/github/toldsoftware/azure-functions-server/badge.svg)](https://coveralls.io/github/toldsoftware/azure-functions-server)

Cli tool and Base Code for Node Azure Functions

## Usage

- npm install @told/azure-functions-server --save

- In Typescript File:

    import * as M from 'azure-functions-server';
    import { SOMETHING } from 'azure-functions-server';

## Final Project Structure

- src-server contains server-only code (code that cannot be tested with karma)
    - azure function entrances
    - server resources access code
- src contains app models and business logic
    - app models and business logic can be tested with karma
    - app models and business logic can be used to do client side processing (that can be verified by server-side processing if needed)
- .deployment controls the azure git deployment to point to "deployment"
- (generated) deployment contains the server-side deployment code
    - a clone of lib code
    - a clone of package.json with dev-dependencies removed
    - a generated function entry point for each entry point in src-server