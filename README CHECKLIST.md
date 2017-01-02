# Npm Boilerplate

[![npm (scoped)](https://img.shields.io/npm/v/@told/npm-boilerplate.svg)](https://www.npmjs.com/package/@told/npm-boilerplate)
[![Build Status](https://travis-ci.org/toldsoftware/npm-boilerplate.svg?branch=master)](https://travis-ci.org/toldsoftware/npm-boilerplate)
[![Coverage Status](https://coveralls.io/repos/github/toldsoftware/npm-boilerplate/badge.svg)](https://coveralls.io/github/toldsoftware/npm-boilerplate)

A minimilistic typescript boilerplate for creating typescript code modules that can be imported with es6 imports.

## Features

- typescript only (no generated code)
- jasmine test framework
- karma test runner
- Npm Github Badge
- Travis CI w/ Github Badge
- Coveralls Code Coverage w/ Github Badge

## Setup

Steps to setup a new project using this boilerplate.

Note: You might want to make a copy of this file if needed

- x Create Empty Github Project
- x Copy this repo into directory (except .git)
- x Rename Notes/HoursNAME.md and start tracking time
- x Replace README and package.json with BOILERPLATE versions
- x Find/Replace MODULE_NAME and MODULE_TITLE
- x Setup NPM
    - x npm install
    - x npm test (Verify everything is working)
- Commit and Push Project to Github
- Create *Coveralls* Project for repo: https://coveralls.io
    - Add Repo
    - Sync repos (At bottom)
    - Find and Add Repo
    - Copy Token: 
        - Settings > Repo Token > [Copy]
- Create *Travis* Project for repo: https://travis-ci.org
    - Add Repo
    - Sync Account
    - Set Environment Variable for *Coveralls*
        - Settings > Environment Variables
            - repo_token
            - TOKEN_FROM_COVERALLS
            - Click "Add"
- Push Any Change to Git
    - Travis: Verify Test Runs
    - Coveralls: Verify Coveralls Received Report
        - May have to Restart Build (Since Token was just set)
- Publish to *NPM*
    - npm publish --access public
- Github: Verify Icons have updated
    - Sometimes this can take a while or the images get cached by the browser.

## OPTIONAL

- Open the OPTIONAL folder and follow the directions in one of the subfolders to add it's boilerplate
- Once done, delete the OPTIONAL folder to remove unneeded boilerplate

## Use

- npm install @told/MODULE_NAME

## Publish Updates

- Publish to *NPM*
    - npm version patch
    - npm publish

- Update in Other Projects
    - npm update

## Note: Visual Studio Code

Most Config Files for this project are hidden in Visual Studio Code because they are pure boilerplate. 

Visibility settings are in:

    .vscode/settings.json