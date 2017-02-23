"use strict";
var tslib_1 = require("tslib");
var fs = require("fs");
var webpack_injection_1 = require("./webpack-injection");
var webpack = require('webpack');
function runWebpackAzureFunction(functionDirsOrFiles, shouldInject) {
    var _this = this;
    if (shouldInject === void 0) { shouldInject = false; }
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
            if (shouldInject) {
                (function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                    return tslib_1.__generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, inject(entries)];
                            case 1:
                                _a.sent();
                                resolve();
                                return [2 /*return*/];
                        }
                    });
                }); })();
            }
            else {
                resolve();
            }
        });
    });
}
exports.runWebpackAzureFunction = runWebpackAzureFunction;
function runWebpackClient(entrySourceFiles, shouldInject) {
    var _this = this;
    if (shouldInject === void 0) { shouldInject = false; }
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
            if (shouldInject) {
                (function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                    return tslib_1.__generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, inject(entries)];
                            case 1:
                                _a.sent();
                                resolve();
                                return [2 /*return*/];
                        }
                    });
                }); })();
            }
            else {
                resolve();
            }
        });
    });
}
exports.runWebpackClient = runWebpackClient;
function inject(files) {
    return new Promise(function (resolve, reject) {
        console.log('Inject START');
        var waitCount = 0;
        var resolveTimeoutId = null;
        var resolveIfDone = function () {
            clearTimeout(resolveTimeoutId);
            resolveTimeoutId = setTimeout(function () {
                if (waitCount > 0) {
                    return;
                }
                console.log('Inject END');
                resolve();
            });
        };
        var destFiles = [];
        for (var key in files) {
            if (files.hasOwnProperty(key)) {
                destFiles.push(key);
            }
        }
        var _loop_1 = function (f) {
            waitCount++;
            fs.readFile(f, 'utf8', function (err, data) {
                if (err) {
                    waitCount--;
                    resolveIfDone();
                    return console.log(err);
                }
                console.log('Inject file=' + f);
                var result = webpack_injection_1.injectWebpack(data);
                fs.writeFile(f, result, 'utf8', function (err) {
                    waitCount--;
                    resolveIfDone();
                    if (err) {
                        return console.log(err);
                    }
                });
            });
        };
        for (var _i = 0, destFiles_1 = destFiles; _i < destFiles_1.length; _i++) {
            var f = destFiles_1[_i];
            _loop_1(f);
        }
        resolveIfDone();
    });
}
//# sourceMappingURL=run-webpack.js.map