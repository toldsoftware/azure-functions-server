var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var ncp = require('ncp').ncp;
var fs = require('fs');
var replaceStream = require('replacestream');
var watch = require('node-watch');
var rimraf = require('rimraf');
var webpack = require('webpack');
// Webpack
function runWebpack(functionDirs) {
    var entries = {};
    functionDirs.filter(function (x) { return x.length > 0; }).forEach(function (x) { return entries[x + '/build.js'] = x + '/build.source.js'; });
    console.log('Webpack START');
    console.log('entries=', entries);
    webpack({
        // configuration
        entry: __assign({}, entries),
        output: {
            path: './',
            filename: '[name]'
        },
        target: 'node',
        node: {
            __filename: false,
            __dirname: false,
        },
    }, function (err, stats) {
        if (err) {
            console.error(err);
            return;
        }
        console.log('Webpack END');
        // console.log(stats);
    });
}
function createDeployment() {
    var functionDirs = [];
    var webpackPending = 0;
    var readyForWebpack = function () {
        webpackPending--;
        if (webpackPending > 0) {
            // console.log('Webpack Not Ready:', webpackPending, functionDirs);
            return;
        }
        // console.log('Webpack Ready:', webpackPending, functionDirs);
        runWebpack(functionDirs);
    };
    console.log('Create Deployment');
    // Clean Directory
    console.log('Clean Deployment Folder');
    if (fs.existsSync('deployment')) {
        rimraf.sync('deployment');
    }
    console.log('Make Deployment Folders');
    fs.mkdirSync('deployment');
    fs.mkdirSync('deployment/lib');
    fs.mkdirSync('deployment/lib/resources');
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
    // Copy lib folder
    webpackPending++;
    ncp('./lib', './deployment/lib', function (err) {
        if (err) {
            console.error(err);
        }
        console.log('Copied "lib/" to "deployment/lib/"');
        readyForWebpack();
    });
    // Copy resources folder
    webpackPending++;
    ncp('./resources', './deployment/lib/resources', function (err) {
        if (err) {
            console.error(err);
        }
        console.log('Copied "resources/" to "deployment/lib/resources"');
        readyForWebpack();
    });
    // Handle Local Run
    var afsLibPath = '@told/azure-functions-server/lib';
    var targetAfsLibPath = afsLibPath;
    try {
        require(afsLibPath);
    }
    catch (err) {
        console.log('LOCAL RUN');
        targetAfsLibPath = './../lib';
    }
    // Create Function Entries
    var serverDir = './src-server';
    fs.readdir(serverDir, function (err, files) {
        if (err) {
            console.error(err);
        }
        var tsFiles = files.filter(function (x) { return x.indexOf('.ts') >= 0; });
        webpackPending += tsFiles.length;
        var _loop_1 = function (i) {
            var f = tsFiles[i];
            var path = serverDir + '/' + f;
            var stream = fs.readFile(path, 'utf8', function (err, data) {
                if (err) {
                    console.error(err);
                }
                if (data.match(/export\s+async\s+function\s+main\s*\(/)) {
                    console.log('src-server main file: ', f);
                    var functionName_1 = f.replace('.ts', '');
                    var functionDir = './deployment/' + functionName_1;
                    // Clone the function-BOILERPLATE folder
                    var functionBoilerplateDir = __dirname.replace(/(\\|\/)src-cli$/, '').replace(/(\\|\/)lib$/, '') + '/resources/function-BOILERPLATE';
                    ncp(functionBoilerplateDir, functionDir, {
                        transform: function (read, write) {
                            read
                                .pipe(replaceStream('FUNCTION_NAME', functionName_1))
                                .pipe(replaceStream(afsLibPath, targetAfsLibPath))
                                .pipe(write);
                        }
                    }, function (err) {
                        if (err) {
                            console.error(err);
                        }
                        console.log('Created Function Boilerplate for ' + functionName_1);
                    });
                    // Ready for Webpack
                    functionDirs.push(functionDir);
                    readyForWebpack();
                }
                else {
                    readyForWebpack();
                }
            });
        };
        for (var i = 0; i < tsFiles.length; i++) {
            _loop_1(i);
        }
    });
}
createDeployment();
if (process.argv.filter(function (x) { return x === '-w'; }).length > 0) {
    var timeoutId_1 = 0;
    watch(['./lib', './resources', './package.json'], function () {
        // Let TSC finish
        console.log('.');
        clearTimeout(timeoutId_1);
        timeoutId_1 = setTimeout(function () {
            console.log('---');
            createDeployment();
        }, 500);
    });
}
//# sourceMappingURL=main.js.map