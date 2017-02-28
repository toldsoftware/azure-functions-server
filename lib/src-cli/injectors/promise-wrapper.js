"use strict";
var call_tree_1 = require("./call-tree");
function _global() {
    if (typeof global !== 'undefined') {
        return global;
    }
    else {
        return window;
    }
}
exports._global = _global;
var Promise_Original = Promise;
function _injectPromiseWrapper() {
    var glob = _global();
    var originalPromise = glob.Promise;
    glob.Promise = _PromiseWrapper;
    // Promise.All and others
    for (var _i = 0, _a = Object.getOwnPropertyNames(originalPromise); _i < _a.length; _i++) {
        var key = _a[_i];
        if (originalPromise.hasOwnProperty(key)
            && !_PromiseWrapper.hasOwnProperty(key)) {
            _PromiseWrapper[key] = originalPromise[key];
        }
    }
}
exports._injectPromiseWrapper = _injectPromiseWrapper;
exports._PromiseInjection = {
    beforeConstructorCallback: function (id) {
        var node = { name: 'PROMISE', id: id, threadId: call_tree_1.getCallTree().threadId, args: '', calls: [], parent: call_tree_1.getCallTree(), err: null, result: null };
        call_tree_1.getCallTree().calls.push(node);
        return node;
    },
    beforeResolveCallback: function (context, id, value) {
        context.result = call_tree_1.stringifySafe(value);
        // Next the continuation under the promise
        // ___callTree = context;
        // Restore to parent context
        call_tree_1.setCallTree(context.parent);
    },
    beforeRejectCallback: function (context, id, reason) {
        context.err = call_tree_1.stringifySafe(reason);
        // Next the continuation under the promise
        // ___callTree = context;
        // Restore to parent context
        call_tree_1.setCallTree(context.parent);
    },
};
// tslint:disable-next-line:class-name
var _PromiseWrapper = (function () {
    function _PromiseWrapper(resolver) {
        var _this = this;
        this.id = '';
        this.id = call_tree_1.getNextId(call_tree_1.getCallTree().threadId);
        this.context = exports._PromiseInjection.beforeConstructorCallback(this.id);
        this.promiseInner = new Promise_Original(function (resolveInner, rejectInner) {
            var resolveOuter = function (value) {
                exports._PromiseInjection.beforeResolveCallback(_this.context, _this.id, value);
                resolveInner(value);
            };
            var rejectOuter = function (reason) {
                exports._PromiseInjection.beforeRejectCallback(_this.context, _this.id, reason);
                rejectInner(reason);
            };
            resolver(resolveOuter, rejectOuter);
        });
    }
    _PromiseWrapper.prototype.then = function (resolve, reject) {
        var _this = this;
        var resolveOuter = function (value) {
            exports._PromiseInjection.beforeResolveCallback(_this.context, _this.id, value);
            resolve(value);
        };
        var rejectOuter = function (reason) {
            exports._PromiseInjection.beforeRejectCallback(_this.context, _this.id, reason);
            reject(reason);
        };
        this.promiseInner.then(resolveOuter, rejectOuter);
        return this;
    };
    _PromiseWrapper.prototype.catch = function (reject) {
        var _this = this;
        var rejectOuter = function (reason) {
            exports._PromiseInjection.beforeRejectCallback(_this.context, _this.id, reason);
            reject(reason);
        };
        this.promiseInner.catch(rejectOuter);
        return this;
    };
    return _PromiseWrapper;
}());
exports._PromiseWrapper = _PromiseWrapper;
//# sourceMappingURL=promise-wrapper.js.map