
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
/******/ 	return __webpack_require__(__webpack_require__.s = 287);
/******/ })
/************************************************************************/
/******/ ({

/***/ 122:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function run(){ return ___call(_f_run,'run',this,arguments); }
function _f_run(tick) {
    return function (context, timer) {
        tick(context, timer)
            .then(function () { })
            .catch(function (err) { return console.error(err); });
    };
}
exports.run = run;


/***/ }),

/***/ 137:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var tslib_1 = __webpack_require__(2);
// https://docs.microsoft.com/en-us/azure/azure-functions/functions-bindings-timer
// {second} {minute} {hour} {day} {month} {day of the week}
// schedule: 0 0 0 * * *
function tick(){ return ___call(_f_tick,'tick',this,arguments); }
function _f_tick(context, timer) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var timeStamp;
        return tslib_1.__generator(this, function (_a) {
            timeStamp = new Date().toISOString();
            if (timer.isPastDue) {
                context.log('Timer is Past Due');
            }
            context.log('Timer ran!', timeStamp);
            context.done();
            return [2 /*return*/];
        });
    });
}
exports.tick = tick;


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

/***/ 287:
/***/ (function(module, exports, __webpack_require__) {

// Intentionally global
___export = __webpack_require__(122).run(__webpack_require__(137).tick);
module.exports = ___export;

/***/ })

/******/ });
// DISABLED source Mapping URL=build.js.map