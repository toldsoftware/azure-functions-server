

var ___callTree = {calls:[]};
var ___callTreeRoot = ___callTree;
var ___log = [];
var ___beforeFunctionCallback = function (name, args) {
    ___callTree = {name: name, args: ___stringifySafe(args), parent: ___callTree, calls:[]};
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
/******/ 	return __webpack_require__(__webpack_require__.s = 262);
/******/ })
/************************************************************************/
/******/ ({

/***/ 121:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var tslib_1 = __webpack_require__(13);
var R = __webpack_require__(55);
function main(){ return ___call(___main,'main',this,arguments); }
function ___main(context, request) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // Serve index.html as the default file
                    request.query.name = 'index.html';
                    return [4 /*yield*/, R.main(context, request, 0)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.main = main;


/***/ }),

/***/ 13:
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

/***/ 14:
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),

/***/ 16:
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),

/***/ 22:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function _printCallTree(callTree, depth) {
    if (depth === void 0) { depth = 0; }
    var text = '';
    for (var d = 0; d < depth; d++) {
        text += '-';
    }
    if (!callTree.err) {
        text += callTree.name + " " + callTree.id + ": " + (callTree.args || '{}') + " => " + (callTree.result || '{}');
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
function _stringifySafe(obj) {
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
exports._stringifySafe = _stringifySafe;


/***/ }),

/***/ 262:
/***/ (function(module, exports, __webpack_require__) {

// Intentionally global
___export = __webpack_require__(32).setDirName(__dirname).serve(__webpack_require__(121).main);
module.exports = ___export;

/***/ }),

/***/ 30:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.dir = { rootDir: '' };


/***/ }),

/***/ 32:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var tslib_1 = __webpack_require__(13);
var path = __webpack_require__(14);
var root_dir_1 = __webpack_require__(30);
var call_tree_1 = __webpack_require__(22);
var promise_wrapper_1 = __webpack_require__(35);
var DEBUG = typeof ___callTree !== 'undefined';
if (DEBUG) {
    promise_wrapper_1.injectPromiseWrapper();
}
function setDirName(){ return ___call(___setDirName,'setDirName',this,arguments); }
function ___setDirName(dirName) {
    root_dir_1.dir.rootDir = path.resolve(dirName, '..');
    return this;
}
exports.setDirName = setDirName;
function serve(){ return ___call(___serve,'serve',this,arguments); }
function ___serve(main) {
    var runner = function (context, request) {
        var ___callTree_runnerRoot = DEBUG ? ___callTree : null;
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
        main(context, req)
            .then(function () {
            if (DEBUG) {
                context.log(call_tree_1._printCallTree(___callTree_runnerRoot));
            }
        })
            .catch(function (err) {
            context.log('Uncaught Error:', err);
            if (DEBUG) {
                context.log(call_tree_1._printCallTree(___callTree_runnerRoot));
            }
            context.done(err, null);
        });
    };
    if (DEBUG) {
        return function () {
            return ___call(runner, 'serve', this, arguments);
        };
    }
    else {
        return runner;
    }
}
exports.serve = serve;


/***/ }),

/***/ 35:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var call_tree_1 = __webpack_require__(22);
var Promise_Original = Promise;
if (typeof ___callTree === 'undefined') {
    ___callTree = { calls: [] };
}
exports.PromiseInjection = {
    beforeConstructorCallback: function (id) {
        var node = { name: 'PROMISE', args: '', calls: [], parent: ___callTree, err: null, result: null };
        ___callTree.calls.push(node);
        return node;
    },
    beforeResolveCallback: function (context, id, value) { context.result = call_tree_1._stringifySafe(value); },
    beforeRejectCallback: function (context, id, reason) { context.err = call_tree_1._stringifySafe(reason); },
};
var _threadId = Math.random() % 9999;
var _nextPromiseId = 0;
var PromiseWrapper = (function () {
    function PromiseWrapper(resolver) {
        var _this = this;
        this.id = '';
        this.id = _threadId + '_' + _nextPromiseId++;
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
    PromiseWrapper.prototype.then = function (resolve, reject) {
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
    PromiseWrapper.prototype.catch = function (reject) {
        var _this = this;
        var rejectOuter = function (reason) {
            exports.PromiseInjection.beforeRejectCallback(_this.context, _this.id, reason);
            reject(reason);
        };
        this.promiseInner.catch(rejectOuter);
        return this;
    };
    return PromiseWrapper;
}());
exports.PromiseWrapper = PromiseWrapper;
function injectPromiseWrapper(){ return ___call(___injectPromiseWrapper,'injectPromiseWrapper',this,arguments); }
function ___injectPromiseWrapper() {
    if (typeof global === 'undefined') {
        global = window;
    }
    var originalPromise = global.Promise;
    global.Promise = PromiseWrapper;
}
exports.injectPromiseWrapper = injectPromiseWrapper;
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

/***/ 55:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var tslib_1 = __webpack_require__(13);
var fs = __webpack_require__(16);
var Path = __webpack_require__(14);
var resolve_url_1 = __webpack_require__(76);
var root_dir_1 = __webpack_require__(30);
function main(){ return ___call(___main,'main',this,arguments); }
function ___main(context, request, pathDepthFromApiRoot) {
    if (pathDepthFromApiRoot === void 0) { pathDepthFromApiRoot = 1; }
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var pathOrig, filePath, path;
        return tslib_1.__generator(this, function (_a) {
            pathOrig = request.query.name || request.pathName;
            filePath = pathOrig
                .replace(/\/$/, '')
                .replace(/\/(file)$/, '')
                .replace(/\/([^\/]+\.js\.map)$/, '.map');
            path = Path.resolve(root_dir_1.dir.rootDir, resolve_url_1.getPathDepthPrefix(pathDepthFromApiRoot - 1), 'resources', filePath.replace(/^\//, ''));
            context.log('filePath=' + filePath + ' path=' + path + ' __dirname=' + __dirname + ' request.query.name=' + request.query.name + ' request.pathName=' + request.pathName);
            fs.readFile(path, function (err, data) {
                context.log('path=' + path);
                if (err != null) {
                    context.log('ERROR: ' + err);
                    context.done(null, {
                        status: 404,
                        headers: {
                            'Content-Type': 'text/plain',
                        },
                        body: ('File Not Found: ' + filePath)
                    });
                    return;
                }
                var type = 'text/plain';
                if (path.match('\.html$')) {
                    type = 'text/html';
                }
                if (path.match('\.css$')) {
                    type = 'text/css';
                }
                if (path.match('\.js$')) {
                    type = 'application/x-javascript';
                }
                if (path.match('\.json$')) {
                    type = 'application/json';
                }
                if (path.match('\.jpg$')) {
                    type = 'image/jpeg';
                }
                if (path.match('\.png$')) {
                    type = 'image/png';
                }
                if (path.match('\.gif$')) {
                    type = 'image/gif';
                }
                if (path.match('\.ico$')) {
                    type = 'image/x-icon';
                }
                // Auto Resolve Resource Urls?
                var body = data;
                if (type === 'text/html') {
                    body = data.toString();
                    body = resolve_url_1.resolveAllUrls(body, pathDepthFromApiRoot);
                }
                // // Prevent Json Curroption
                // if (type === 'application/json') {
                //     body = data.toString();
                //     body = JSON.parse(body);
                // }
                context.done(null, {
                    headers: {
                        'Content-Type': type,
                    },
                    body: body,
                    // Bypass response handling
                    isRaw: true
                });
            });
            return [2 /*return*/];
        });
    });
}
exports.main = main;


/***/ }),

/***/ 76:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function resolveUrlClient(){ return ___call(___resolveUrlClient,'resolveUrlClient',this,arguments); }
function ___resolveUrlClient(url) {
    if (url.indexOf('./') !== 0) {
        return url;
    }
    var pathname = window.location.pathname;
    var prefix = '/';
    if (pathname.match(/^\/api\//)) {
        prefix = '/api/';
    }
    return resolveUrl_inner(url, prefix);
}
exports.resolveUrlClient = resolveUrlClient;
function resolveUrl(){ return ___call(___resolveUrl,'resolveUrl',this,arguments); }
function ___resolveUrl(url, pathDepthFromApiRoot) {
    if (pathDepthFromApiRoot === void 0) { pathDepthFromApiRoot = 1; }
    if (url.indexOf('./') !== 0) {
        return url;
    }
    var depthPrefix = getPathDepthPrefix(pathDepthFromApiRoot);
    return resolveUrl_inner(url, depthPrefix);
}
exports.resolveUrl = resolveUrl;
function resolveUrl_inner(){ return ___call(___resolveUrl_inner,'resolveUrl_inner',this,arguments); }
function ___resolveUrl_inner(url, prefix) {
    url = url.substr(2);
    // If file extension, make file
    if (url.match(/[^/]\.[^/]+$/)) {
        return prefix + "resource/" + url + "/file";
    }
    else {
        return "" + prefix + url + "?q";
    }
}
function resolveAllUrls(){ return ___call(___resolveAllUrls,'resolveAllUrls',this,arguments); }
function ___resolveAllUrls(content, pathDepthFromApiRoot) {
    return content
        .replace(/"(\.\/[^"]+)"/g, function (x) { return '"' + resolveUrl(x.substr(1, x.length - 2), pathDepthFromApiRoot) + '"'; })
        .replace(/'(\.\/[^']+)'/g, function (x) { return '\'' + resolveUrl(x.substr(1, x.length - 2), pathDepthFromApiRoot) + '\''; });
}
exports.resolveAllUrls = resolveAllUrls;
function getPathDepthPrefix(){ return ___call(___getPathDepthPrefix,'getPathDepthPrefix',this,arguments); }
function ___getPathDepthPrefix(pathDepthFromApiRoot) {
    var depthPrefix = '';
    for (var i = 0; i < pathDepthFromApiRoot; i++) {
        depthPrefix += '../';
    }
    return depthPrefix;
}
exports.getPathDepthPrefix = getPathDepthPrefix;


/***/ })

/******/ });
//# sourceMappingURL=build.js.map