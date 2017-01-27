"use strict";
var tslib_1 = require("tslib");
var fs = require("fs");
var rimraf = require("rimraf");
var ncp_1 = require("ncp");
var replaceStream = require("replacestream");
var watch = require("node-watch");
var run_webpack_1 = require("./run-webpack");
// declare var require: any;
// declare var __dirname: string;
// declare var process: { argv: string[] };
// const ncp = require('ncp').ncp;
// const fs = require('fs');
// const replaceStream = require('replacestream');
// const watch = require('node-watch');
// const rimraf = require('rimraf');
function getBoilerplatePath(boilerplateResourcePath) {
    return __dirname.replace(/(\\|\/)src-cli$/, '').replace(/(\\|\/)lib$/, '') + boilerplateResourcePath;
}
function delay(time) {
    if (time === void 0) { time = 1000; }
    return new Promise(function (resolve) { return setTimeout(function () { return resolve(); }, time); });
}
var timeoutId;
var isRunning = false;
function keepAlive() {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
        isRunning = false;
    }, 5000);
}
function waitUntilReady() {
    return new Promise(function (resolve) {
        var id = setInterval(function () {
            if (!isRunning) {
                clearInterval(id);
                resolve();
            }
        }, 1000);
    });
}
function createDeployment() {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var _this = this;
        var functionDirsOrFiles_1, entrySourceFiles_1, pending_1, ready_1, afsLibPath_1, targetAfsLibPath_1, serverDir_1, clientDir_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, waitUntilReady()];
                case 1:
                    _a.sent();
                    isRunning = true;
                    keepAlive();
                    try {
                        functionDirsOrFiles_1 = [];
                        entrySourceFiles_1 = [];
                        pending_1 = 0;
                        ready_1 = function () {
                            (function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                return tslib_1.__generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            keepAlive();
                                            pending_1--;
                                            if (pending_1 > 0) {
                                                // console.log('Webpack Not Ready:', webpackPending, functionDirs);
                                                return [2 /*return*/];
                                            }
                                            // console.log('Webpack Ready:', webpackPending, functionDirs);
                                            // Wait a sec
                                            return [4 /*yield*/, run_webpack_1.runWebpackAzureFunction(functionDirsOrFiles_1)];
                                        case 1:
                                            // console.log('Webpack Ready:', webpackPending, functionDirs);
                                            // Wait a sec
                                            _a.sent();
                                            return [4 /*yield*/, run_webpack_1.runWebpackClient(entrySourceFiles_1)];
                                        case 2:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); })().then();
                        };
                        pending_1++;
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
                        }
                        catch (err) {
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
                        pending_1++;
                        ncp_1.ncp('./resources', './deployment/resources', function (err) {
                            if (err) {
                                console.error(err);
                            }
                            console.log('Copied "resources/" to "deployment/resources"');
                            ready_1();
                        });
                        afsLibPath_1 = '@told/azure-functions-server/lib';
                        targetAfsLibPath_1 = afsLibPath_1;
                        try {
                            require(afsLibPath_1);
                        }
                        catch (err) {
                            console.log('LOCAL RUN');
                            targetAfsLibPath_1 = './../../lib';
                        }
                        // Create Test Main
                        try {
                            console.log('Create Test Main');
                            fs.createReadStream(getBoilerplatePath('/resources/test-main-RESOURCES/test-main.js'))
                                .pipe(replaceStream(afsLibPath_1, targetAfsLibPath_1.replace('./../../lib', './../lib')))
                                .pipe(fs.createWriteStream('./deployment/test-main.source.js'));
                            functionDirsOrFiles_1.push('./deployment/test-main.source.js');
                        }
                        catch (err) {
                            console.error(err);
                        }
                        serverDir_1 = './src-server';
                        fs.readdir(serverDir_1, function (err, files) {
                            if (err) {
                                console.error(err);
                            }
                            var tsFiles = files.filter(function (x) { return x.indexOf('.ts') >= 0; });
                            pending_1 += tsFiles.length;
                            var _loop_1 = function (i) {
                                var f = tsFiles[i];
                                var path = serverDir_1 + '/' + f;
                                var stream = fs.readFile(path, 'utf8', function (err, data) {
                                    if (err) {
                                        console.error(err);
                                    }
                                    // Http Responses
                                    if (data.match(/export\s+async\s+function\s+main\s*\(/)) {
                                        console.log('src-server main file: ', f);
                                        var functionName_1 = f.replace('.ts', '');
                                        var functionDir = './deployment/' + functionName_1;
                                        var boilerplatePath = '/resources/function-BOILERPLATE';
                                        if (f.match(/^default\./)) {
                                            boilerplatePath = '/resources/default-BOILERPLATE';
                                        }
                                        // Clone the function-BOILERPLATE folder
                                        var functionBoilerplateDir = getBoilerplatePath(boilerplatePath);
                                        ncp_1.ncp(functionBoilerplateDir, functionDir, {
                                            transform: function (read, write) {
                                                read
                                                    .pipe(replaceStream('FUNCTION_NAME', functionName_1))
                                                    .pipe(replaceStream(afsLibPath_1, targetAfsLibPath_1))
                                                    .pipe(write);
                                            }
                                        }, function (err) {
                                            if (err) {
                                                console.error(err);
                                            }
                                            console.log('Created Function Boilerplate for ' + functionName_1);
                                        });
                                        // Ready for Webpack
                                        functionDirsOrFiles_1.push(functionDir);
                                        ready_1();
                                    }
                                    else if (data.match(/export\s+async\s+function\s+tick\s*\(/)) {
                                        console.log('src-server tick file: ', f);
                                        var functionName_2 = f.replace('.ts', '');
                                        var functionDir = './deployment/' + functionName_2;
                                        var schedule_1 = '0 */5 * * * *';
                                        var targetSchedule_1 = '0 */5 * * * *';
                                        var scheduleRegex = /\/\/\s*schedule:((?:\s+(?:\*|\*\/[0-9]+|[0-9]+)){6})/;
                                        var mSchedule = data.match(scheduleRegex);
                                        if (mSchedule) {
                                            targetSchedule_1 = mSchedule[1].trim();
                                        }
                                        // Clone the function-BOILERPLATE folder
                                        var functionBoilerplateDir = getBoilerplatePath('/resources/timer-BOILERPLATE');
                                        ncp_1.ncp(functionBoilerplateDir, functionDir, {
                                            transform: function (read, write) {
                                                read
                                                    .pipe(replaceStream('FUNCTION_NAME', functionName_2))
                                                    .pipe(replaceStream(afsLibPath_1, targetAfsLibPath_1))
                                                    .pipe(replaceStream(schedule_1, targetSchedule_1))
                                                    .pipe(write);
                                            }
                                        }, function (err) {
                                            if (err) {
                                                console.error(err);
                                            }
                                            console.log('Created Function Boilerplate for ' + functionName_2);
                                        });
                                        // Ready for Webpack
                                        functionDirsOrFiles_1.push(functionDir);
                                        ready_1();
                                    }
                                    else {
                                        ready_1();
                                    }
                                });
                            };
                            for (var i = 0; i < tsFiles.length; i++) {
                                _loop_1(i);
                            }
                        });
                        clientDir_1 = './src-client';
                        fs.readdir(clientDir_1, function (err, files) {
                            if (err) {
                                console.error(err);
                            }
                            var tsFiles = files.filter(function (x) { return x.indexOf('.ts') >= 0; });
                            pending_1 += tsFiles.length;
                            var _loop_2 = function (i) {
                                var f = tsFiles[i];
                                var path = clientDir_1 + '/' + f;
                                var stream = fs.readFile(path, 'utf8', function (err, data) {
                                    if (err) {
                                        console.error(err);
                                    }
                                    // Client 
                                    // Must have setup(); at end of file
                                    if (data.match(/\n\s*setup\s*\(\s*\);\s*$/)) {
                                        console.log('src-client entry file: ', f);
                                        var entryName = f.replace('.ts', '');
                                        var boilerplatePath = getBoilerplatePath('/resources/client-BOILERPLATE/ENTRY_NAME.source.js');
                                        var targetPath = "./deployment/resources/" + entryName + ".source.js";
                                        try {
                                            fs.createReadStream(boilerplatePath)
                                                .pipe(replaceStream('ENTRY_NAME', entryName))
                                                .pipe(replaceStream(afsLibPath_1, targetAfsLibPath_1))
                                                .pipe(fs.createWriteStream(targetPath));
                                            console.log('Created Client Boilerplate for ' + entryName);
                                        }
                                        catch (err) {
                                            console.error(err);
                                        }
                                        // Ready for Webpack
                                        entrySourceFiles_1.push(targetPath);
                                        ready_1();
                                    }
                                    else {
                                        ready_1();
                                    }
                                });
                            };
                            for (var i = 0; i < tsFiles.length; i++) {
                                _loop_2(i);
                            }
                        });
                        ready_1();
                    }
                    catch (err) {
                        console.error('Uncaught Exception: ', err);
                    }
                    isRunning = false;
                    return [2 /*return*/];
            }
        });
    });
}
createDeployment().then();
var timerId;
function runWhenReady() {
    // Let TSC finish
    console.log('.');
    clearInterval(timerId);
    timerId = setInterval(function () {
        console.log('.nr.');
        if (!isRunning) {
            console.log('---');
            createDeployment().then();
            clearInterval(timerId);
        }
    }, 500);
}
if (process.argv.filter(function (x) { return x === '-w'; }).length > 0) {
    watch(['./lib', './resources', './package.json'], function () { return runWhenReady(); });
}
//# sourceMappingURL=main.js.map