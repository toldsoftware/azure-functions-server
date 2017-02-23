export interface CallTreeNode {
    name: string;
    args: string;
    parent: CallTreeNode;
    calls: CallTreeNode[];
    result: string;
    err: string;
}
export declare function _printCallTree(callTree: CallTreeNode, depth?: number): string;
export declare function _stringifySafe(obj: any): string;
