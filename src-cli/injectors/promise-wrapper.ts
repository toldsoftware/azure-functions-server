import { CallTreeNode, getCallTree, setCallTree, getNextId, stringifySafe } from './call-tree';

declare var global: any;
declare var window: any;
export function _global() {

    if (typeof global !== 'undefined') {
        return global;
    } else {
        return window;
    }
}

type PromiseType<T> = Promise<T>;
let Promise_Original = Promise;

export function _injectPromiseWrapper() {

    const glob = _global();

    let originalPromise = glob.Promise;
    glob.Promise = _PromiseWrapper;

    // Promise.All and others
    for (let key of Object.getOwnPropertyNames(originalPromise)) {
        if (originalPromise.hasOwnProperty(key)
            && !_PromiseWrapper.hasOwnProperty(key)) {
            (_PromiseWrapper as any)[key] = originalPromise[key];
        }
    }
}

export const _PromiseInjection = {
    beforeConstructorCallback: (id: string) => {
        const node: CallTreeNode = { name: 'PROMISE', id, threadId: getCallTree().threadId, args: '', calls: [], parent: getCallTree(), err: null, result: null };
        getCallTree().calls.push(node);
        return node;
    },
    beforeResolveCallback: (context: CallTreeNode, id: string, value: any) => {
        context.result = stringifySafe(value);

        // Next the continuation under the promise
        // ___callTree = context;

        // Restore to parent context
        setCallTree(context.parent);
    },
    beforeRejectCallback: (context: CallTreeNode, id: string, reason: any) => {
        context.err = stringifySafe(reason);

        // Next the continuation under the promise
        // ___callTree = context;

        // Restore to parent context
        setCallTree(context.parent);
    },
};

// tslint:disable-next-line:class-name
export class _PromiseWrapper<T> {

    private id = '';
    private context: any;
    private promiseInner: PromiseType<T>;

    constructor(resolver: (resolve: (value: T) => void, reject: (reason: string) => void) => void) {
        this.id = getNextId(getCallTree().threadId);
        this.context = _PromiseInjection.beforeConstructorCallback(this.id);

        this.promiseInner = new Promise_Original((resolveInner, rejectInner) => {
            let resolveOuter = (value: T) => {
                _PromiseInjection.beforeResolveCallback(this.context, this.id, value);
                resolveInner(value);
            };

            let rejectOuter = (reason: any) => {
                _PromiseInjection.beforeRejectCallback(this.context, this.id, reason);
                rejectInner(reason);
            };

            resolver(resolveOuter, rejectOuter);
        });
    }

    then(resolve: (result: T) => void, reject: (err: any) => void) {
        let resolveOuter = (value: T) => {
            _PromiseInjection.beforeResolveCallback(this.context, this.id, value);

            resolve(value);
        };
        let rejectOuter = (reason: T) => {
            _PromiseInjection.beforeRejectCallback(this.context, this.id, reason);
            reject(reason);
        };
        this.promiseInner.then(resolveOuter, rejectOuter);

        return this;
    }

    catch(reject: (err: any) => void) {
        let rejectOuter = (reason: T) => {
            _PromiseInjection.beforeRejectCallback(this.context, this.id, reason);
            reject(reason);
        };
        this.promiseInner.catch(rejectOuter);

        return this;
    }
}
