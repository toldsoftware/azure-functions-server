import * as fs from 'fs';
import * as rimraf from 'rimraf';
import { ncp } from 'ncp';
import * as replaceStream from 'replacestream';
import * as watch from 'node-watch';

import { runWebpackAzureFunction, runWebpackClient } from './run-webpack';

// declare var require: any;
// declare var __dirname: string;
// declare var process: { argv: string[] };

// const ncp = require('ncp').ncp;
// const fs = require('fs');
// const replaceStream = require('replacestream');
// const watch = require('node-watch');
// const rimraf = require('rimraf');

function getBoilerplatePath(boilerplateResourcePath: string) {
    return __dirname.replace(/(\\|\/)src-cli$/, '').replace(/(\\|\/)lib$/, '') + boilerplateResourcePath;
}

function delay(time = 1000) {
    return new Promise(resolve => setTimeout(() => resolve(), time));
}

let timeoutId: any;
let isRunning = false;
function keepAlive() {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
        isRunning = false;
    }, 5000);
}

function waitUntilReady() {
    return new Promise(resolve => {
        let id = setInterval(() => {
            if (!isRunning) {
                clearInterval(id);
                resolve();
            }
        }, 1000);
    });
}

async function createDeployment() {
    await waitUntilReady();
    isRunning = true;
    keepAlive();
    try {

        let functionDirsOrFiles: string[] = [];
        let entrySourceFiles: string[] = [];

        let pending = 0;
        let ready = () => {
            (async () => {
                keepAlive();
                pending--;
                if (pending > 0) {
                    // console.log('Webpack Not Ready:', webpackPending, functionDirs);
                    return;
                }

                // console.log('Webpack Ready:', webpackPending, functionDirs);
                // Wait a sec
                await runWebpackAzureFunction(functionDirsOrFiles);
                await runWebpackClient(entrySourceFiles);
            })().then();
        };

        pending++;
        console.log('Create Deployment');

        // Clean Directory
        console.log('Clean Deployment Folder');
        if (fs.existsSync('deployment')) {
            rimraf.sync('deployment');
        }
        console.log('Make Deployment Folders');
        fs.mkdirSync('deployment');
        // fs.mkdirSync('deployment/lib');
        fs.mkdirSync('deployment/resources');

        // Not Needed with Webpack
        // // Copy package.json
        // webpackPending++;
        // ncp('./package.json', './deployment/package.json', (err: any) => {
        //     if (err) {
        //         console.error(err);
        //     }
        //     console.log('Copied "package.json" to "deployment"');
        //     readyForWebpack();
        // });

        // Don't copy lib folder (instead change to point to lib folder)
        // // Copy lib folder
        // webpackPending++;
        // ncp('./lib', './deployment/lib', (err: any) => {
        //     if (err) { console.error(err); }
        //     console.log('Copied "lib/" to "deployment/lib/"');
        //     readyForWebpack();
        // });

        // Copy resources folder
        pending++;
        ncp('./resources', './deployment/resources', (err: any) => {
            if (err) { console.error(err); }
            console.log('Copied "resources/" to "deployment/resources"');
            ready();
        });

        // Handle Local Run
        let afsLibPath = '@told/azure-functions-server/lib';
        let targetAfsLibPath = afsLibPath;
        try {
            require(afsLibPath);
        } catch (err) {
            console.log('LOCAL RUN');
            targetAfsLibPath = './../../lib';
        }

        // Create Test Main
        try {
            console.log('Create Test Main');
            fs.createReadStream(getBoilerplatePath('/resources/test-main-RESOURCES/test-main.js'))
                .pipe(replaceStream(afsLibPath, targetAfsLibPath.replace('./../../lib', './../lib')))
                .pipe(fs.createWriteStream('./deployment/test-main.source.js'));
            functionDirsOrFiles.push('./deployment/test-main.source.js');
        } catch (err) {
            console.error(err);
        }

        // TEST
        // await delay(25000);

        // Create Function Entries
        let serverDir = './src-server';
        fs.readdir(serverDir, (err: any, files: string[]) => {
            if (err) { console.error(err); }

            let tsFiles = files.filter(x => x.indexOf('.ts') >= 0);
            pending += tsFiles.length;

            for (let i = 0; i < tsFiles.length; i++) {
                let f = tsFiles[i];

                let path = serverDir + '/' + f;

                let stream = fs.readFile(path, 'utf8', (err: any, data: string) => {
                    if (err) { console.error(err); }

                    // Http Responses
                    if (data.match(/export\s+async\s+function\s+main\s*\(/)) {
                        console.log('src-server main file: ', f);

                        let functionName = f.replace('.ts', '');
                        let functionDir = './deployment/' + functionName;

                        let boilerplatePath = '/resources/function-BOILERPLATE';
                        if (f.match(/^default\./)) {
                            boilerplatePath = '/resources/default-BOILERPLATE';
                        }

                        // Clone the function-BOILERPLATE folder
                        let functionBoilerplateDir = getBoilerplatePath(boilerplatePath);
                        ncp(functionBoilerplateDir, functionDir, {
                            transform: (read: any, write: any) => {
                                read
                                    // Replace Function Name
                                    .pipe(replaceStream('FUNCTION_NAME', functionName))
                                    .pipe(replaceStream(afsLibPath, targetAfsLibPath))
                                    .pipe(write);
                            }
                        }, (err: any) => {
                            if (err) { console.error(err); }
                            console.log('Created Function Boilerplate for ' + functionName);
                        });

                        // Ready for Webpack
                        functionDirsOrFiles.push(functionDir);
                        ready();
                    }
                    // Timers
                    else if (data.match(/export\s+async\s+function\s+tick\s*\(/)) {
                        console.log('src-server tick file: ', f);

                        let functionName = f.replace('.ts', '');
                        let functionDir = './deployment/' + functionName;

                        let schedule = '0 */5 * * * *';
                        let targetSchedule = '0 */5 * * * *';

                        let scheduleRegex = /\/\/\s*schedule:((?:\s+(?:\*|\*\/[0-9]+|[0-9]+)){6})/;
                        let mSchedule = data.match(scheduleRegex);
                        if (mSchedule) {
                            targetSchedule = mSchedule[1].trim();
                        }

                        // Clone the function-BOILERPLATE folder
                        let functionBoilerplateDir = getBoilerplatePath('/resources/timer-BOILERPLATE');
                        ncp(functionBoilerplateDir, functionDir, {
                            transform: (read: any, write: any) => {
                                read
                                    // Replace Function Name
                                    .pipe(replaceStream('FUNCTION_NAME', functionName))
                                    .pipe(replaceStream(afsLibPath, targetAfsLibPath))
                                    .pipe(replaceStream(schedule, targetSchedule))
                                    .pipe(write);
                            }
                        }, (err: any) => {
                            if (err) { console.error(err); }
                            console.log('Created Function Boilerplate for ' + functionName);
                        });

                        // Ready for Webpack
                        functionDirsOrFiles.push(functionDir);
                        ready();
                    }
                    else {
                        ready();
                    }
                });
            }

        });

        // Create Client Entries
        let clientDir = './src-client';
        fs.readdir(clientDir, (err: any, files: string[]) => {
            if (err) { console.error(err); }

            let tsFiles = files.filter(x => x.indexOf('.ts') >= 0);
            pending += tsFiles.length;

            for (let i = 0; i < tsFiles.length; i++) {
                let f = tsFiles[i];

                let path = clientDir + '/' + f;

                let stream = fs.readFile(path, 'utf8', (err: any, data: string) => {
                    if (err) { console.error(err); }

                    // Client 
                    // Must have setup(); at end of file
                    if (data.match(/\n\s*setup\s*\(\s*\);\s*$/)) {
                        console.log('src-client entry file: ', f);

                        let entryName = f.replace('.ts', '');

                        let boilerplatePath = getBoilerplatePath('/resources/client-BOILERPLATE/ENTRY_NAME.source.js');
                        let targetPath = `./deployment/resources/${entryName}.source.js`;

                        try {
                            fs.createReadStream(boilerplatePath)
                                // Replace Entry Name
                                .pipe(replaceStream('ENTRY_NAME', entryName))
                                .pipe(replaceStream(afsLibPath, targetAfsLibPath))
                                .pipe(fs.createWriteStream(targetPath));

                            console.log('Created Client Boilerplate for ' + entryName);
                        } catch (err) {
                            console.error(err);
                        }

                        // Ready for Webpack
                        entrySourceFiles.push(targetPath);
                        ready();
                    }
                    else {
                        ready();
                    }
                });
            }

        });

        ready();
    } catch (err) {
        console.error('Uncaught Exception: ', err);
    }

    isRunning = false;
}

createDeployment().then();

let timerId: any;
function runWhenReady() {
    // Let TSC finish
    console.log('.');

    clearInterval(timerId);
    timerId = setInterval(() => {
        console.log('.nr.');
        if (!isRunning) {
            console.log('---');
            createDeployment().then();
            clearInterval(timerId);
        }
    }, 500);
}

if (process.argv.filter(x => x === '-w').length > 0) {
    watch(['./lib', './resources', './package.json'], () => runWhenReady());
}