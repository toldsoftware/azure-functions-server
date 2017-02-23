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
        var node = { name: 'PROMISE', id: id, args: '', calls: [], parent: ___callTree, err: null, result: null };
        ___callTree.calls.push(node);
        return node;
    },
    beforeResolveCallback: function (context, id, value) { context.result = ___stringifySafe(value); },
    beforeRejectCallback: function (context, id, reason) { context.err = ___stringifySafe(reason); },
};
var PromiseWrapper = (function () {
    function PromiseWrapper(resolver) {
        var _this = this;
        this.id = '';
        this.id = ___getNextId();
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
function injectPromiseWrapper() {
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
//# sourceMappingURL=promise-wrapper.js.map