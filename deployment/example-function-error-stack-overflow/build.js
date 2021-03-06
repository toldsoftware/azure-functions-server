
var ___nextId = ___nextId || 0;
var ___process = process || '_NO_PROCESS_';
var ___threadId = '' + Math.floor(Math.random() * 10000);

function ___getNextId(parentThreadId) {
    return ___process.pid + '_' + ___threadId + '_' + ___nextId++;
}
var ___callTree = { name: '_root', id: ___getNextId(___threadId), threadId: ___threadId, args: '', parent: null, calls: [] };
var ___log = [];
var ___beforeFunctionCallback = function (name, args) {
    ___callTree = { name: name, id: ___getNextId(___callTree.threadId), threadId: ___callTree.threadId, args: ___stringifySafe(args), parent: ___callTree, calls: [] };
    ___callTree.parent.calls.push(___callTree);
    return -1 + ___log.push(___callTree);
}
var ___afterFunctionCallback = function (iLog, name, result, err) {
    ___log[iLog].result = ___stringifySafe(result);
    ___log[iLog].err = ___stringifySafe(err);
    ___callTree = ___callTree.parent;
}
function ___call(fun, name, that, args) {
    var iLog = ___beforeFunctionCallback(name, args);
    try {
        var result = fun.apply(that, args);
        ___afterFunctionCallback(iLog, name, result);
        return result;
    } catch (err) {
        ___afterFunctionCallback(iLog, name, null, err);
        throw err;
    }
}

// http://stackoverflow.com/questions/10101508/how-do-i-wrap-a-constructor
function ___wrapConstructor(constructorInner, name) {

    var proto = constructorInner.prototype;
    var inner = (function(p) {
        function f() {};
        f.prototype = p.prototype;
        return new f;
    })(proto);

    function Outer() {
        constructorInner.apply(this, arguments);
        let that = this;

        var loop = function(key){
            if (proto.hasOwnProperty(key) && typeof proto[key] === 'function') {
                that[key] = function () { 
                    return ___call(proto[key], name + '.' + key, that, arguments); 
                }
            }
        };

        for (var key in proto) {
            loop(key);
        }
    }

    Outer.prototype = inner;
    return Outer;
};

function ___stringifySafe(obj) {
    var seen = [];
    return JSON.stringify(obj, function (key, val) {
        if (val != null && typeof val === 'object') {
            if (seen.indexOf(val) >= 0
                || key === 'parent'
                || key === 'context'
            ) {
                return;
            }
            seen.push(val);
        } else if (val != null && typeof val === 'string' && val.length > 40) {
            return val.substr(0, 40) + '...';
        }

        return val;
    });
}

/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 280);
/******/ })
/************************************************************************/
/******/ ({

/***/ 11:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.dir = { rootDir: '' };


/***/ }),

/***/ 130:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var tslib_1 = __webpack_require__(2);
function main(){ return ___call(_f_main,'main',this,arguments); }
function _f_main(context, request) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var x, recursive;
        return tslib_1.__generator(this, function (_a) {
            x = [10];
            recursive = function () {
                var y = x = x.concat(10);
                return y.concat(recursive()).concat(recursive());
            };
            recursive();
            context.done(null, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json',
                    'X-Told-Test-Header': 'test-header',
                },
                body: {
                    ok: true,
                    data: { text: 'Example Output' },
                }
            });
            return [2 /*return*/];
        });
    });
}
exports.main = main;


/***/ }),

/***/ 17:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
__export(__webpack_require__(19));


/***/ }),

/***/ 18:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var call_tree_1 = __webpack_require__(4);
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


/***/ }),

/***/ 19:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var _logger = function (message) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    console.log.apply(console, [message].concat(args));
};
function setLogger(){ return ___call(_f_setLogger,'setLogger',this,arguments); }
function _f_setLogger(logger) {
    _logger = logger;
}
exports.setLogger = setLogger;
function log(){ return ___call(_f_log,'log',this,arguments); }
function _f_log(message) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    _logger && _logger.apply(void 0, [message].concat(args));
}
exports.log = log;


/***/ }),

/***/ 2:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["__extends"] = __extends;
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__assign", function() { return __assign; });
/* harmony export (immutable) */ __webpack_exports__["__rest"] = __rest;
/* harmony export (immutable) */ __webpack_exports__["__decorate"] = __decorate;
/* harmony export (immutable) */ __webpack_exports__["__param"] = __param;
/* harmony export (immutable) */ __webpack_exports__["__metadata"] = __metadata;
/* harmony export (immutable) */ __webpack_exports__["__awaiter"] = __awaiter;
/* harmony export (immutable) */ __webpack_exports__["__generator"] = __generator;
/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */
function __extends(d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};

var __assign = Object.assign || function __assign(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
};

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

function __param(paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};

function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
};

function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
    return { next: verb(0), "throw": verb(1), "return": verb(2) };
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};

/***/ }),

/***/ 280:
/***/ (function(module, exports, __webpack_require__) {

// Intentionally global
___export = __webpack_require__(7).setDirName(__dirname).serve(__webpack_require__(130).main);
module.exports = ___export;

/***/ }),

/***/ 4:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function _printCallTree(callTree, depth) {
    if (depth === void 0) { depth = 0; }
    var text = '';
    for (var d = 0; d < depth; d++) {
        text += '-';
    }
    if (!callTree.err) {
        text += callTree.name + " " + callTree.id + ": " + _abbreviate(callTree.args || '{}') + " => " + _abbreviate(callTree.result || '{}');
    }
    else {
        text += "ERROR " + callTree.name + " " + callTree.id + ": " + callTree.args + " => " + callTree.err;
    }
    text += '\r\n';
    for (var _i = 0, _a = callTree.calls; _i < _a.length; _i++) {
        var c = _a[_i];
        text += _printCallTree(c, depth + 1);
    }
    return text;
}
exports._printCallTree = _printCallTree;
function _abbreviate(text, maxLength) {
    if (maxLength === void 0) { maxLength = 255; }
    if (text.length <= maxLength) {
        return text;
    }
    return text.substr(0, maxLength) + '...';
}
// export function _ensureGlobalExists<T>(name: string, getDefault: () => T): T {
//     return _global()[name] = _global()[name] || getDefault();
// }
exports.DEBUG = typeof ___callTree !== 'undefined';
function getCallTree(){ return ___call(_f_getCallTree,'getCallTree',this,arguments); }
function _f_getCallTree() {
    if (exports.DEBUG) {
        return ___callTree;
    }
    else {
        return { calls: [] };
    }
}
exports.getCallTree = getCallTree;
function setCallTree(){ return ___call(_f_setCallTree,'setCallTree',this,arguments); }
function _f_setCallTree(value) {
    if (exports.DEBUG) {
        ___callTree = value;
    }
}
exports.setCallTree = setCallTree;
function callFunction(){ return ___call(_f_callFunction,'callFunction',this,arguments); }
function _f_callFunction(fun, name, that, args) {
    if (exports.DEBUG) {
        return ___call(fun, name, that, args);
    }
    else {
        return fun.apply(that, args);
    }
}
exports.callFunction = callFunction;
function getNextId(){ return ___call(_f_getNextId,'getNextId',this,arguments); }
function _f_getNextId(threadId) {
    if (exports.DEBUG) {
        return ___getNextId(threadId);
    }
    else {
        return '' + Date.now();
    }
}
exports.getNextId = getNextId;
function stringifySafe(){ return ___call(_f_stringifySafe,'stringifySafe',this,arguments); }
function _f_stringifySafe(obj) {
    var seen = [];
    return JSON.stringify(obj, function (key, val) {
        if (val != null && typeof val === 'object') {
            if (seen.indexOf(val) >= 0
                || key === 'parent'
                || key === 'context') {
                return;
            }
            seen.push(val);
        }
        else if (val != null && typeof val === 'string' && val.length > 40) {
            return val.substr(0, 40) + '...';
        }
        return val;
    });
}
exports.stringifySafe = stringifySafe;


/***/ }),

/***/ 6:
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),

/***/ 7:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var tslib_1 = __webpack_require__(2);
var path = __webpack_require__(6);
var T = __webpack_require__(17);
var root_dir_1 = __webpack_require__(11);
var call_tree_1 = __webpack_require__(4);
var promise_wrapper_1 = __webpack_require__(18);
var _callTreeRoot = null;
if (call_tree_1.DEBUG) {
    promise_wrapper_1._injectPromiseWrapper();
    _callTreeRoot = call_tree_1.getCallTree();
}
function setDirName(){ return ___call(_f_setDirName,'setDirName',this,arguments); }
function _f_setDirName(dirName) {
    root_dir_1.dir.rootDir = path.resolve(dirName, '..');
    return this;
}
exports.setDirName = setDirName;
function serve(){ return ___call(_f_serve,'serve',this,arguments); }
function _f_serve(main) {
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


/***/ })

/******/ });
// DISABLED source Mapping URL=build.js.map