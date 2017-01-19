"use strict";
var tslib_1 = require("tslib");
var webpack = require('webpack');
function runWebpack(functionDirs) {
    var entries = {};
    functionDirs.filter(function (x) { return x.length > 0; }).forEach(function (x) { return entries[x + '/build.js'] = x + '/build.source.js'; });
    console.log('Webpack START');
    console.log('entries=', entries);
    webpack({
        // configuration
        entry: tslib_1.__assign({}, entries),
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
exports.runWebpack = runWebpack;
//# sourceMappingURL=run-webpack.js.map