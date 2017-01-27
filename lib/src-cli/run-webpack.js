"use strict";
var tslib_1 = require("tslib");
var webpack = require('webpack');
function runWebpackAzureFunction(functionDirsOrFiles) {
    return new Promise(function (resolve, reject) {
        var entries = {};
        functionDirsOrFiles.filter(function (x) { return x.length > 0; }).forEach(function (x) {
            if (x.indexOf('.source.js') >= 0) {
                entries[x.replace('.source.js', '.js')] = x;
            }
            else {
                entries[x + '/build.js'] = x + '/build.source.js';
            }
        });
        console.log('Webpack Azure Functions START');
        console.log('entries=', entries);
        webpack({
            // configuration
            entry: tslib_1.__assign({}, entries),
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
        }, function (err, stats) {
            if (err) {
                console.error(err);
                reject();
                return;
            }
            console.log('Webpack Azure Functions END');
            // console.log(stats);
            resolve();
        });
    });
}
exports.runWebpackAzureFunction = runWebpackAzureFunction;
function runWebpackClient(entrySourceFiles) {
    return new Promise(function (resolve, reject) {
        var entries = {};
        entrySourceFiles.filter(function (x) { return x.length > 0; }).forEach(function (x) { return entries[x.replace('.source.js', '.js')] = x; });
        console.log('Webpack Client START');
        console.log('entries=', entries);
        webpack({
            // configuration
            entry: tslib_1.__assign({}, entries),
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
            plugins: []
        }, function (err, stats) {
            if (err) {
                console.error(err);
                reject();
                return;
            }
            console.log('Webpack Client END');
            // console.log(stats);
            resolve();
        });
    });
}
exports.runWebpackClient = runWebpackClient;
//# sourceMappingURL=run-webpack.js.map