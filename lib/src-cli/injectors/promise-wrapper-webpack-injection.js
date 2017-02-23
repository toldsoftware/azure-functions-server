"use strict";
function injectPromiseLogger(webpackSource) {
    var i = webpackSource.indexOf('module.exports = Promise;');
    console.log("injectPromiseLogger @ " + i);
    return webpackSource.replace('module.exports = Promise;', PromiseWrapper + " module.exports = PromiseWrapper;");
}
exports.injectPromiseLogger = injectPromiseLogger;
var PromiseWrapper = "\nvar Promise_Original = Promise;\nvar PromiseInjection = {\n    beforeConstructorCallback: function (id) { console.log('PromiseCreate:', id); },\n    beforeResolveCallback: function (id, value) { console.log('PromiseResolve:', id, value); },\n    beforeRejectCallback: function (id, reason) { console.log('PromiseReject:', id, reason); },\n};\nvar _nextPromiseId = 0;\nvar PromiseWrapper = (function () {\n    function PromiseWrapper(resolver) {\n        var _this = this;\n        this.id = '';\n        this.id = '' + _nextPromiseId++;\n        PromiseInjection.beforeConstructorCallback(this.id);\n        this.promiseInner = new Promise_Original(function (resolveInner, rejectInner) {\n            var resolveOuter = function (value) {\n                PromiseInjection.beforeResolveCallback(_this.id, value);\n                resolveInner(value);\n            };\n            var rejectOuter = function (reason) {\n                PromiseInjection.beforeRejectCallback(_this.id, reason);\n                rejectInner(reason);\n            };\n            resolver(resolveOuter, rejectOuter);\n        });\n    }\n    PromiseWrapper.prototype.then = function (resolve, reject) {\n        var _this = this;\n        var resolveOuter = function (value) {\n            PromiseInjection.beforeResolveCallback(_this.id, value);\n            resolve(value);\n        };\n        var rejectOuter = function (reason) {\n            PromiseInjection.beforeRejectCallback(_this.id, reason);\n            reject(reason);\n        };\n        this.promiseInner.then(resolveOuter, rejectOuter);\n    };\n    PromiseWrapper.prototype.catch = function (reject) {\n        var _this = this;\n        var rejectOuter = function (reason) {\n            PromiseInjection.beforeRejectCallback(_this.id, reason);\n            reject(reason);\n        };\n        this.promiseInner.catch(rejectOuter);\n    };\n    return PromiseWrapper;\n}());\n";
//# sourceMappingURL=promise-wrapper-webpack-injection.js.map