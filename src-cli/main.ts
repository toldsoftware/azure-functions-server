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
    }, 30000);
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
            keepAlive();
            pending--;
            if (pending > 0) {
                // console.log('Webpack Not Ready:', webpackPending, functionDirs);
                return;
            }

            (async () => {
                // Create Test Main
                await new Promise((resolve, reject) => {
                    console.log('Create Test Main');
                    try {
                        // Function Runner
                        let functionNames = functionDirsOrFiles
                            .filter(x => x.length > 0 && x.indexOf('.js') < 0)
                            .map(x => x.replace('./deployment/', ''));

                        functionNames.sort();

                        let functions = functionNames
                            .map(x => `{name: '${x}', main: require('${'./../../lib/src-server/' + x}').main }`)
                            .join(',\n\t');

                        console.log('Create Test Main');
                        fs.mkdirSync('deployment/test-main');
                        
                        fs.createReadStream(getBoilerplatePath('/resources/test-main-RESOURCES/test-main.js'))
                            .on('end', () => resolve())
                            .pipe(replaceStream(afsLibPath, targetAfsLibPath))
                            .pipe(replaceStream('FUNCTION_MODULES', functions))
                            .pipe(fs.createWriteStream('./deployment/test-main/test-main.source.js'));

                        functionDirsOrFiles.push('./deployment/test-main/test-main.source.js');

                        // Index
                        let functionsLinks = functionNames
                            .map(x => `<a href='/${x}'>${x}</a><br>`)
                            .join('\n\t');

                        console.log('Create Test Main index.html');
                        fs.createReadStream(getBoilerplatePath('/resources/test-main-RESOURCES/index.html'))
                            .on('end', () => resolve())
                            .pipe(replaceStream('FUNCTION_LINKS', functionsLinks))
                            .pipe(fs.createWriteStream('./deployment/resources/test-main.html'));
                    } catch (err) {
                        console.error(err);
                        resolve();
                    }
                });

                // Wabpack
                console.log('Webpack');
                await runWebpackClient(entrySourceFiles);
                await runWebpackAzureFunction(functionDirsOrFiles);
            })().then();
        };

        pending++;
        console.log('Create Deployment');

        // Clean Directory
        try {
            console.log('Clean Deployment Folder');
            if (fs.existsSync('deployment')) {
                rimraf.sync('deployment');
            }
            console.log('Make Deployment Folders');
            fs.mkdirSync('deployment');
            // fs.mkdirSync('deployment/lib');
            fs.mkdirSync('deployment/resources');
        } catch (err) {
            // Debugger might prevent this
        }

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
        if (!isRunning) {
            clearInterval(timerId);
            console.log('---');
            createDeployment().then();
        } else {
            console.log('.nr.');
        }
    }, 5000);
}

if (process.argv.filter(x => x === '-w').length > 0) {
    watch(['./lib', './resources', './package.json'], () => runWhenReady());
}