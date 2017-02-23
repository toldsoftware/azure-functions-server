import { _stringifySafe, CallTreeNode } from './call-tree';

type PromiseType<T> = Promise<T>;
let Promise_Original = Promise;

declare var ___callTree: CallTreeNode;
if (typeof ___callTree === 'undefined') { ___callTree = { calls: [] } as CallTreeNode; }

export const PromiseInjection = {
    beforeConstructorCallback: (id: string) => {
        const node: CallTreeNode = { name: 'PROMISE ' + id, args: '', calls: [], parent: ___callTree, err: null, result: null };
        ___callTree.calls.push(node);
        return node;
    },
    beforeResolveCallback: (context: CallTreeNode, id: string, value: any) => { context.result = _stringifySafe(value); },
    beforeRejectCallback: (context: CallTreeNode, id: string, reason: any) => { context.err = _stringifySafe(reason); },
};

let _nextPromiseId = 0;
export class PromiseWrapper<T> {

    private id = '';
    private context: any;
    private promiseInner: PromiseType<T>;

    constructor(resolver: (resolve: (value: T) => void, reject: (reason: string) => void) => void) {
        this.id = '' + _nextPromiseId++;
        this.context = PromiseInjection.beforeConstructorCallback(this.id);

        this.promiseInner = new Promise_Original((resolveInner, rejectInner) => {
            let resolveOuter = (value: T) => {
                PromiseInjection.beforeResolveCallback(this.context, this.id, value);
                resolveInner(value);
            };

            let rejectOuter = (reason: any) => {
                PromiseInjection.beforeRejectCallback(this.context, this.id, reason);
                rejectInner(reason);
            };

            resolver(resolveOuter, rejectOuter);
        });
    }

    then(resolve: (result: T) => void, reject: (err: any) => void) {
        let resolveOuter = (value: T) => {
            PromiseInjection.beforeResolveCallback(this.context, this.id, value);

            resolve(value);
        };
        let rejectOuter = (reason: T) => {
            PromiseInjection.beforeRejectCallback(this.context, this.id, reason);
            reject(reason);
        };
        this.promiseInner.then(resolveOuter, rejectOuter);

        return this;
    }

    catch(reject: (err: any) => void) {
        let rejectOuter = (reason: T) => {
            PromiseInjection.beforeRejectCallback(this.context, this.id, reason);
            reject(reason);
        };
        this.promiseInner.catch(rejectOuter);

        return this;
    }
}

declare var global: any;
declare var window: any;
export function injectPromiseWrapper() {

    if (typeof global === 'undefined') {
        global = window;
    }

    let originalPromise = global.Promise;
    global.Promise = PromiseWrapper;
}

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