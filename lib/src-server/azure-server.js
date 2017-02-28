"use strict";
var tslib_1 = require("tslib");
var path = require("path");
var T = require("./../src/index");
var root_dir_1 = require("./../src/root-dir");
var call_tree_1 = require("../src-cli/injectors/call-tree");
var promise_wrapper_1 = require("../src-cli/injectors/promise-wrapper");
var _callTreeRoot = null;
if (call_tree_1.DEBUG) {
    promise_wrapper_1._injectPromiseWrapper();
    _callTreeRoot = call_tree_1.getCallTree();
}
function setDirName(dirName) {
    root_dir_1.dir.rootDir = path.resolve(dirName, '..');
    return this;
}
exports.setDirName = setDirName;
function serve(main) {
    var _callTree_runnerRoot = null;
    var runner = function (context, request) {
        T.setLogger(function (message) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            return context.log.apply(context, [message].concat(args));
        });
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
        if (call_tree_1.DEBUG) {
            var contextInner_1 = context;
            context = {
                done: function () {
                    return call_tree_1.callFunction(contextInner_1.done, 'done', contextInner_1, arguments);
                },
                log: function () {
                    // Don't wrap log
                    return contextInner_1.log.apply(contextInner_1, arguments);
                }
            };
        }
        var debugIntervalId = null;
        var start = Date.now();
        try {
            if (call_tree_1.DEBUG) {
                debugIntervalId = setInterval(function () {
                    context.log("LONG PROCESS: " + (Date.now() - start) + "ms");
                    if (call_tree_1.DEBUG) {
                        context.log(call_tree_1._printCallTree(_callTree_runnerRoot));
                    }
                }, 10 * 1000);
            }
            // Run
            main(context, req)
                .then(function () {
                if (call_tree_1.DEBUG) {
                    clearTimeout(debugIntervalId);
                    context.log(call_tree_1._printCallTree(_callTree_runnerRoot));
                }
            })
                .catch(function (err) {
                context.log('UNCAUGHT ERROR (Promise):', err);
                if (call_tree_1.DEBUG) {
                    clearTimeout(debugIntervalId);
                    context.log(call_tree_1._printCallTree(_callTree_runnerRoot));
                }
                context.done(err, null);
            });
        }
        catch (err) {
            context.log('UNCAUGHT ERROR:', err);
            if (call_tree_1.DEBUG) {
                clearTimeout(debugIntervalId);
                context.log(call_tree_1._printCallTree(_callTree_runnerRoot));
            }
            context.done(err, null);
        }
    };
    if (call_tree_1.DEBUG) {
        var innerIsolate_1 = function () {
            _callTree_runnerRoot = call_tree_1.getCallTree();
            return call_tree_1.callFunction(runner, 'serve', this, arguments);
        };
        return function () {
            call_tree_1.setCallTree(_callTreeRoot);
            return call_tree_1.callFunction(innerIsolate_1, 'request', this, arguments);
        };
    }
    else {
        return runner;
    }
}
exports.serve = serve;
//# sourceMappingURL=azure-server.js.map