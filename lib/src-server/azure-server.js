"use strict";
var tslib_1 = require("tslib");
var path = require("path");
var root_dir_1 = require("./../src/root-dir");
var call_tree_1 = require("../src-cli/injectors/call-tree");
var promise_wrapper_1 = require("../src-cli/injectors/promise-wrapper");
var DEBUG = typeof ___callTree !== 'undefined';
if (DEBUG) {
    promise_wrapper_1.injectPromiseWrapper();
}
function setDirName(dirName) {
    root_dir_1.dir.rootDir = path.resolve(dirName, '..');
    return this;
}
exports.setDirName = setDirName;
function serve(main) {
    return function (context, request) {
        var req = tslib_1.__assign({}, request);
        req.pathName = req.pathName || context.bindingData.pathName || '';
        req.pathParts = req.pathName.split('/').filter(function (x) { return x.length > 0; });
        if (req.query.ping != null) {
            context.done(null, {
                status: 200,
                headers: { 'Content-Type': 'text/plain' },
                body: 'PONG',
            });
            return;
        }
        // Auto-Parse Json
        if (typeof req.body === 'string') {
            var orig = req.body;
            try {
                req.body = JSON.parse(req.body);
            }
            catch (err) {
                req.body = orig;
            }
        }
        main(context, req)
            .then(function () {
            if (DEBUG) {
                context.log(call_tree_1._printCallTree(___callTree));
            }
        })
            .catch(function (err) {
            context.log('Uncaught Error:', err);
            if (DEBUG) {
                context.log(call_tree_1._printCallTree(___callTree));
            }
            context.done(err, null);
        });
    };
}
exports.serve = serve;
//# sourceMappingURL=azure-server.js.map