declare var require: any;
declare var __dirname: string;
declare var process: { argv: string[] };

const ncp = require('ncp').ncp;
const fs = require('fs');
const replaceStream = require('replacestream');
const watch = require('node-watch');
const rimraf = require('rimraf');

const webpack = require('webpack');

// Webpack
function runWebpack(functionDirs: string[]) {
    let entries: { [name: string]: string } = {};
    functionDirs.filter(x => x.length > 0).forEach(x => entries[x + '/build.js'] = x + '/build.source.js');

    console.log('Webpack START');
    console.log('entries=', entries);

    webpack({
        // configuration
        entry: {
            // './index.webpack.js': './index.js',
            ...entries
        },
        output: {
            path: './',
            filename: '[name]'
        },
        target: 'node',
        node: {
            __filename: false,
            __dirname: false,
        },
    }, (err: any, stats: any) => {
        if (err) { console.error(err); return; }
        console.log('Webpack END');
        // console.log(stats);
    });
}

function createDeployment() {
    let functionDirs: string[] = [];
    let webpackPending = 0;
    let readyForWebpack = () => {
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
    ncp('./lib', './deployment/lib', (err: any) => {
        if (err) { console.error(err); }
        console.log('Copied "lib/" to "deployment/lib/"');
        readyForWebpack();
    });

    // Copy resources folder
    webpackPending++;
    ncp('./resources', './deployment/lib/resources', (err: any) => {
        if (err) { console.error(err); }
        console.log('Copied "resources/" to "deployment/lib/resources"');
        readyForWebpack();
    });

    // Handle Local Run
    let afsLibPath = '@told/azure-functions-server/lib';
    let targetAfsLibPath = afsLibPath;
    try {
        require(afsLibPath);
    } catch (err) {
        console.log('LOCAL RUN');
        targetAfsLibPath = './../lib';
    }

    // Create Function Entries
    let serverDir = './src-server';
    fs.readdir(serverDir, (err: any, files: string[]) => {
        if (err) { console.error(err); }

        let tsFiles = files.filter(x => x.indexOf('.ts') >= 0);
        webpackPending += tsFiles.length;

        for (let i = 0; i < tsFiles.length; i++) {
            let f = tsFiles[i];

            let path = serverDir + '/' + f;

            let stream = fs.readFile(path, 'utf8', (err: any, data: string) => {
                if (err) { console.error(err); }

                if (data.match(/export\s+async\s+function\s+main\s*\(/)) {
                    console.log('src-server main file: ', f);

                    let functionName = f.replace('.ts', '');
                    let functionDir = './deployment/' + functionName;

                    // Clone the function-BOILERPLATE folder
                    let functionBoilerplateDir = __dirname.replace(/(\\|\/)src-cli$/, '').replace(/(\\|\/)lib$/, '') + '/resources/function-BOILERPLATE';
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
                    functionDirs.push(functionDir);
                    readyForWebpack();
                }
                else {
                    readyForWebpack();
                }
            });
        }

    });
}

createDeployment();

if (process.argv.filter(x => x === '-w').length > 0) {
    let timeoutId = 0;
    watch(['./lib', './resources', './package.json'], () => {
        // Let TSC finish
        console.log('.');
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            console.log('---');
            createDeployment();
        }, 500);
    });
}