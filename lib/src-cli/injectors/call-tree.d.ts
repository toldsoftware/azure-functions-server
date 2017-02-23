export interface CallTreeNode {
    name: string;
    id: string;
    threadId: string;
    args: string;
    parent: CallTreeNode;
    calls: CallTreeNode[];
    result: string;
    err: string;
}
export declare function _printCallTree(callTree: CallTreeNode, depth?: number): string;
export declare type Call = (fun: Function, name: string, that: any, args: any) => any;
export declare type BeforeFunctionCallback = (name: string, args: any) => number;
export declare type AfterFunctionCallback = (iLog: number, name: string, result: any, err: any) => void;
