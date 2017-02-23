import { CallTreeNode } from './call-tree';
export declare const PromiseInjection: {
    beforeConstructorCallback: (id: string) => CallTreeNode;
    beforeResolveCallback: (context: CallTreeNode, id: string, value: any) => void;
    beforeRejectCallback: (context: CallTreeNode, id: string, reason: any) => void;
};
export declare class PromiseWrapper<T> {
    private id;
    private context;
    private promiseInner;
    constructor(resolver: (resolve: (value: T) => void, reject: (reason: string) => void) => void);
    then(resolve: (result: T) => void, reject: (err: any) => void): void;
    catch(reject: (err: any) => void): void;
}
export declare function injectPromiseWrapper(): void;
