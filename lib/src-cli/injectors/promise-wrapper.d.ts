import { CallTreeNode } from './call-tree';
export declare function _global(): any;
export declare function _injectPromiseWrapper(): void;
export declare const _PromiseInjection: {
    beforeConstructorCallback: (id: string) => CallTreeNode;
    beforeResolveCallback: (context: CallTreeNode, id: string, value: any) => void;
    beforeRejectCallback: (context: CallTreeNode, id: string, reason: any) => void;
};
export declare class _PromiseWrapper<T> {
    private id;
    private context;
    private promiseInner;
    constructor(resolver: (resolve: (value: T) => void, reject: (reason: string) => void) => void);
    then(resolve: (result: T) => void, reject: (err: any) => void): this;
    catch(reject: (err: any) => void): this;
}
