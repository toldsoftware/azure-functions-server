
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

function ___wrapMethods(inner) {
    let outer = Object.create(inner);

    for (var key in inner) {
        if (inner.hasOwnProperty(key) && typeof inner[key] === 'function') {
            outer[key] = function () { return ___call(inner[key], key, inner, arguments); }
        }
    }

    return outer;
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

        for (var key in proto) {
            if (proto.hasOwnProperty(key) && typeof proto[key] === 'function') {
                this[key] = function () { 
                    return ___call(proto[key], name + '.' + key, this, arguments); 
                }
            }
        }
    }

    Outer.prototype = inner;
    return Outer;
};

function ___stringifySafe(obj) {
    let seen = [];
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
/******/ 	return __webpack_require__(__webpack_require__.s = 271);
/******/ })
/************************************************************************/
/******/ ({

/***/ 123:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var tslib_1 = __webpack_require__(2);
function main(){ return ___call(_f_main,'main',this,arguments); }
function _f_main(context, request) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var obj, val, sub, stat, result, v;
        return tslib_1.__generator(this, function (_a) {
            obj = new TestClass(1, 2, 7);
            val = obj.testMethod();
            sub = new TestSubClass(1, 2, 7);
            sub.testMethod();
            sub.testMethod2();
            stat = new TestStaticClass();
            result = TestStaticClass.method();
            v = TestStaticClass.val;
            context.done(null, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json',
                    'X-Told-Test-Header': 'test-header',
                },
                body: {
                    ok: true,
                    data: { text: 'Value: ' + val },
                }
            });
            return [2 /*return*/];
        });
    });
}
exports.main = main;
var TestClass = (function () {
    function TestClass(a, b, c) {
        this.c = c;
        this.val = 0;
        this.val = a + b;
    }
    TestClass.prototype.testMethod = function () {
        return "a+b=" + this.val + "; this.c=" + this.c;
    };
return ___wrapConstructor(TestClass, 'TestClass');
}());
exports.TestClass = TestClass;
var TestSubClass = (function (_super) {
    tslib_1.__extends(TestSubClass, _super);
    function TestSubClass(a, b, c) {
        return _super.call(this, a, b, c) || this;
    }
    TestSubClass.prototype.testMethod2 = function () {
        return "a+b=" + this.val + "; this.c=" + this.c;
    };
return ___wrapConstructor(TestSubClass, 'TestSubClass');
}(TestClass));
exports.TestSubClass = TestSubClass;
var TestStaticClass = (function () {
    function TestStaticClass() {
    }
    TestStaticClass.method = function () {
        return TestStaticClass.val;
    };
    return TestStaticClass;
}());
TestStaticClass.val = 0;
exports.TestStaticClass = TestStaticClass;


/***/ }),

/***/ 15:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.dir = { rootDir: '' };


/***/ }),

/***/ 17:
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


/***/ }),

/***/ 18:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var Promise_Original = Promise;
if (typeof ___callTree === 'undefined') {
    ___callTree = { calls: [] };
}
if (typeof ___getNextId === 'undefined') {
    ___getNextId = function () { return '-1'; };
}
if (typeof ___stringifySafe === 'undefined') {
    ___stringifySafe = function () { return '___undefined___stringifySafe'; };
}
exports.PromiseInjection = {
    beforeConstructorCallback: function (id) {
        var node = { name: 'PROMISE', id: id, threadId: ___callTree.threadId, args: '', calls: [], parent: ___callTree, err: null, result: null };
        ___callTree.calls.push(node);
        return node;
    },
    beforeResolveCallback: function (context, id, value) {
        context.result = ___stringifySafe(value);
        // Next the continuation under the promise
        // ___callTree = context;
        // Restore to parent context
        ___callTree = context.parent;
    },
    beforeRejectCallback: function (context, id, reason) {
        context.err = ___stringifySafe(reason);
        // Next the continuation under the promise
        // ___callTree = context;
        // Restore to parent context
        ___callTree = context.parent;
    },
};
// tslint:disable-next-line:class-name
var _PromiseWrapper = (function () {
    function _PromiseWrapper(resolver) {
        var _this = this;
        this.id = '';
        this.id = ___getNextId(___callTree.threadId);
        this.context = exports.PromiseInjection.beforeConstructorCallback(this.id);
        this.promiseInner = new Promise_Original(function (resolveInner, rejectInner) {
            var resolveOuter = function (value) {
                exports.PromiseInjection.beforeResolveCallback(_this.context, _this.id, value);
                resolveInner(value);
            };
            var rejectOuter = function (reason) {
                exports.PromiseInjection.beforeRejectCallback(_this.context, _this.id, reason);
                rejectInner(reason);
            };
            resolver(resolveOuter, rejectOuter);
        });
    }
    _PromiseWrapper.prototype.then = function (resolve, reject) {
        var _this = this;
        var resolveOuter = function (value) {
            exports.PromiseInjection.beforeResolveCallback(_this.context, _this.id, value);
            resolve(value);
        };
        var rejectOuter = function (reason) {
            exports.PromiseInjection.beforeRejectCallback(_this.context, _this.id, reason);
            reject(reason);
        };
        this.promiseInner.then(resolveOuter, rejectOuter);
        return this;
    };
    _PromiseWrapper.prototype.catch = function (reject) {
        var _this = this;
        var rejectOuter = function (reason) {
            exports.PromiseInjection.beforeRejectCallback(_this.context, _this.id, reason);
            reject(reason);
        };
        this.promiseInner.catch(rejectOuter);
        return this;
    };
    return _PromiseWrapper;
}());
exports._PromiseWrapper = _PromiseWrapper;
function _injectPromiseWrapper() {
    if (typeof global === 'undefined') {
        global = window;
    }
    var originalPromise = global.Promise;
    global.Promise = _PromiseWrapper;
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
// Replace Original Promise
// Promise['constructor'] = PromiseWrapper['constructor'];
// export const PromiseWrapper;
// export PromiseInjection;
// function invokeResolver(resolver, promise) {
//     function resolvePromise(value) {
//         resolve(promise, value);
//     }
//     function rejectPromise(reason) {
//         reject(promise, reason);
//     }
//     try {
//         resolver(resolvePromise, rejectPromise);
//     } catch (e) {
//         rejectPromise(e);
//     }
// }
// function Promise(resolver) {
//     if (typeof resolver !== 'function') {
//         throw new TypeError('Promise resolver ' + resolver + ' is not a function');
//     }
//     if (this instanceof Promise === false) {
//         throw new TypeError('Failed to construct \'Promise\': Please use the \'new\' operator, this object constructor cannot be called as a function.');
//     }
//     this._then = [];
//     invokeResolver(resolver, this);
// }
// Promise.prototype = {
//     constructor: Promise,
//     _state: PENDING,
//     _then: null,
//     _data: undefined,
//     _handled: false,
//     then: function (onFulfillment, onRejection) {
//         var subscriber = {
//             owner: this,
//             then: new this.constructor(NOOP),
//             fulfilled: onFulfillment,
//             rejected: onRejection
//         };
//         if ((onRejection || onFulfillment) && !this._handled) {
//             this._handled = true;
//             if (this._state === REJECTED && isNode) {
//                 asyncCall(notifyRejectionHandled, this);
//             }
//         }
//         if (this._state === FULFILLED || this._state === REJECTED) {
//             // already resolved, call callback async
//             asyncCall(invokeCallback, subscriber);
//         } else {
//             // subscribe
//             this._then.push(subscriber);
//         }
//         return subscriber.then;
//     },
//     catch: function (onRejection) {
//         return this.then(null, onRejection);
//     }
// };
// function Promise(resolver) {
// 	if (typeof resolver !== 'function') {
// 		throw new TypeError('Promise resolver ' + resolver + ' is not a function');
// 	}
// 	if (this instanceof Promise === false) {
// 		throw new TypeError('Failed to construct \'Promise\': Please use the \'new\' operator, this object constructor cannot be called as a function.');
// 	}
// 	this._then = [];
// 	invokeResolver(resolver, this);
// }
// Promise.prototype = {
// 	constructor: Promise,
// 	_state: PENDING,
// 	_then: null,
// 	_data: undefined,
// 	_handled: false,
// 	then: function (onFulfillment, onRejection) {
// 		var subscriber = {
// 			owner: this,
// 			then: new this.constructor(NOOP),
// 			fulfilled: onFulfillment,
// 			rejected: onRejection
// 		};
// 		if ((onRejection || onFulfillment) && !this._handled) {
// 			this._handled = true;
// 			if (this._state === REJECTED && isNode) {
// 				asyncCall(notifyRejectionHandled, this);
// 			}
// 		}
// 		if (this._state === FULFILLED || this._state === REJECTED) {
// 			// already resolved, call callback async
// 			asyncCall(invokeCallback, subscriber);
// 		} else {
// 			// subscribe
// 			this._then.push(subscriber);
// 		}
// 		return subscriber.then;
// 	},
// 	catch: function (onRejection) {
// 		return this.then(null, onRejection);
// 	}
// }; 


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

/***/ 271:
/***/ (function(module, exports, __webpack_require__) {

// Intentionally global
___export = __webpack_require__(9).setDirName(__dirname).serve(__webpack_require__(123).main);
module.exports = ___export;

/***/ }),

/***/ 6:
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),

/***/ 9:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var tslib_1 = __webpack_require__(2);
var path = __webpack_require__(6);
var root_dir_1 = __webpack_require__(15);
var call_tree_1 = __webpack_require__(17);
var promise_wrapper_1 = __webpack_require__(18);
// declare var ___beforeFunctionCallback: BeforeFunctionCallback;
// declare var ___afterFunctionCallback: AfterFunctionCallback;
var DEBUG = typeof ___callTree !== 'undefined';
var _callTreeRoot = null;
if (DEBUG) {
    promise_wrapper_1._injectPromiseWrapper();
    _callTreeRoot = ___callTree;
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
        if (DEBUG) {
            var contextInner_1 = context;
            context = {
                done: function () {
                    return ___call(contextInner_1.done, 'done', contextInner_1, arguments);
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
            if (DEBUG) {
                debugIntervalId = setInterval(function () {
                    context.log("LONG PROCESS: " + (Date.now() - start) + "ms");
                    if (DEBUG) {
                        clearTimeout(debugIntervalId);
                        context.log(call_tree_1._printCallTree(_callTree_runnerRoot));
                    }
                }, 10 * 1000);
            }
            // Run
            main(context, req)
                .then(function () {
                if (DEBUG) {
                    clearTimeout(debugIntervalId);
                    context.log(call_tree_1._printCallTree(_callTree_runnerRoot));
                }
            })
                .catch(function (err) {
                context.log('UNCAUGHT ERROR (Promise):', err);
                if (DEBUG) {
                    clearTimeout(debugIntervalId);
                    context.log(call_tree_1._printCallTree(_callTree_runnerRoot));
                }
                context.done(err, null);
            });
        }
        catch (err) {
            context.log('UNCAUGHT ERROR:', err);
            if (DEBUG) {
                clearTimeout(debugIntervalId);
                context.log(call_tree_1._printCallTree(_callTree_runnerRoot));
            }
            context.done(err, null);
        }
    };
    if (DEBUG) {
        var innerIsolate_1 = function () {
            _callTree_runnerRoot = ___callTree;
            return ___call(runner, 'serve', this, arguments);
        };
        return function () {
            ___callTree = _callTreeRoot;
            return ___call(innerIsolate_1, 'request', this, arguments);
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