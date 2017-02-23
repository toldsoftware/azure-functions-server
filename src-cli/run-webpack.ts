import * as fs from 'fs';
import * as path from 'path';
import { injectWebpack } from './webpack-injection';

declare var require: any;
const webpack = require('webpack');

export function runWebpackAzureFunction(functionDirsOrFiles: string[], shouldInject = false) {
    return new Promise((resolve, reject) => {
        let entries: { [name: string]: string } = {};
        functionDirsOrFiles.filter(x => x.length > 0).forEach(x => {
            if (x.indexOf('.source.js') >= 0) {
                entries[x.replace('.source.js', '.js')] = x;
            } else {
                entries[x + '/build.js'] = x + '/build.source.js';
            }
        });

        console.log('Webpack Azure Functions START');
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
            devtool: 'source-map',
            target: 'node',
            node: {
                __filename: false,
                __dirname: false,
            },
            module: {
                rules: [
                    {
                        test: /\.js$/,
                        use: ['source-map-loader'],
                        enforce: 'pre'
                    }
                ]
            }
        }, (err: any, stats: any) => {
            if (err) { console.error(err); reject(); return; }
            console.log('Webpack Azure Functions END');
            // console.log(stats);

            if (shouldInject) {
                (async () => {
                    await inject(entries, await getOwnSourceCode());
                    resolve();
                })();
            } else {
                resolve();
            }
        });
    });
}

export function runWebpackClient(entrySourceFiles: string[], shouldInject = false) {
    return new Promise((resolve, reject) => {
        let entries: { [name: string]: string } = {};
        entrySourceFiles.filter(x => x.length > 0).forEach(x => entries[x.replace('.source.js', '.js')] = x);

        console.log('Webpack Client START');
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
            devtool: '#source-map',
            module: {
                rules: [
                    {
                        test: /\.js$/,
                        use: ['source-map-loader'],
                        enforce: 'pre'
                    }
                ]
            },
            // resolve: {
            //     extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js']
            // },
            // module: {
            //     rules: [{
            //         test: /\.tsx?$/,
            //         loader: 'ts-loader'
            //     }]
            // },
            plugins: [
                //     new BrowserSyncPlugin({
                //     host: 'localhost',
                //     port: 3000,
                //     server: {
                //         baseDir: ['./resources']
                //     }
                // })
                // , 
                // // Uglify
                // new webpack.optimize.UglifyJsPlugin({
                //     sourceMap: true,
                //     mangle: false,
                //     test: /\.(js|jsx)$/
                // })
            ]
        }, (err: any, stats: any) => {
            if (err) { console.error(err); reject(); return; }
            console.log('Webpack Client END');
            // console.log(stats);

            if (shouldInject) {
                (async () => {
                    await inject(entries, await getOwnSourceCode());
                    resolve();
                })();
            } else {
                resolve();
            }

        });
    });
}

let _ownSourceCode: string;
function getOwnSourceCode() {
    return new Promise<string>((resolve, reject) => {
        if (_ownSourceCode) { resolve(_ownSourceCode); }
        (async () => {
            let files = await walkDir('./lib/');
            let pending = files.length;
            for (let f of files) {
                fs.readFile(f, 'utf8', function (err, data) {
                    _ownSourceCode += data + '\r\n';
                    pending--;
                    if (!pending) {
                        resolve(_ownSourceCode);
                    }
                });
            }
        })().then();
    });
}

// From: http://stackoverflow.com/questions/5827612/node-js-fs-readdir-recursive-directory-search
function walkDir(dir: string) {
    return new Promise<string[]>((resolve, reject) => {
        let results: string[] = [];
        fs.readdir(dir, function (err, list) {
            if (err) return reject(err);
            let pending = list.length;
            if (!pending) return resolve(results);
            list.forEach(function (file) {
                file = path.resolve(dir, file);
                fs.stat(file, function (err, stat) {
                    if (stat && stat.isDirectory()) {
                        walkDir(file).then(innerResults => {
                            results = results.concat(innerResults);
                            if (!--pending) resolve(results);
                        });
                    } else {
                        results.push(file);
                        if (!--pending) resolve(results);
                    }
                });
            });
        });
    });
}

function inject(files: { [name: string]: string }, ownSourceCode: string) {
    return new Promise((resolve, reject) => {
        console.log('Inject START');

        let pending = 0;
        let resolveTimeoutId: any = null;
        let resolveIfDone = () => {
            clearTimeout(resolveTimeoutId);
            resolveTimeoutId = setTimeout(() => {
                if (pending > 0) { return; }
                console.log('Inject END');
                resolve();
            });
        };

        // Process Files
        let destFiles: string[] = [];

        for (let key in files) {
            if (files.hasOwnProperty(key)) {
                destFiles.push(key);
            }
        }

        for (let f of destFiles) {
            pending++;
            fs.readFile(f, 'utf8', function (err, data) {
                if (err) {
                    pending--;
                    resolveIfDone();
                    return console.log(err);
                }

                console.log('Inject file=' + f);
                let result = injectWebpack(data, ownSourceCode);

                fs.writeFile(f, result, 'utf8', function (err) {
                    pending--;
                    resolveIfDone();
                    if (err) { return console.log(err); }
                });
            });
        }

        resolveIfDone();
    });
}