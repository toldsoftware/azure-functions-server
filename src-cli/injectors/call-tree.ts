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

export function _printCallTree(callTree: CallTreeNode, depth = 0): string {
    let text = '';

    for (let d = 0; d < depth; d++) {
        text += '-';
    }

    if (!callTree.err) {
        text += `${callTree.name} ${callTree.id}: ${_abbreviate(callTree.args || '{}')} => ${_abbreviate(callTree.result || '{}')}`;
    } else {
        text += `ERROR ${callTree.name} ${callTree.id}: ${callTree.args} => ${callTree.err}`;
    }

    text += '\r\n';

    for (let c of callTree.calls) {
        text += _printCallTree(c, depth + 1);
    }

    return text;
}

function _abbreviate(text: string, maxLength = 255) {
    if (text.length <= maxLength) { return text; }

    return text.substr(0, maxLength) + '...';
}

export type Call = (fun: Function, name: string, that: any, args: any) => any;
export type BeforeFunctionCallback = (name: string, args: any) => number;
export type AfterFunctionCallback = (iLog: number, name: string, result: any, err: any) => void;


declare var ___callTree: CallTreeNode;
declare var ___call: Call;
declare var ___callTree: CallTreeNode;
declare var ___getNextId: (threadId: string) => string;
declare var ___stringifySafe: (obj: any) => string;

// export function _ensureGlobalExists<T>(name: string, getDefault: () => T): T {
//     return _global()[name] = _global()[name] || getDefault();
// }

export const DEBUG = typeof ___callTree !== 'undefined';
export function getCallTree() {
    if (DEBUG) { return ___callTree; }
    else { return { calls: [] } as any; }
}

export function setCallTree(value: CallTreeNode) {
    if (DEBUG) { ___callTree = value; }
}

export function callFunction(fun: Function, name: string, that: any, args: any) {
    if (DEBUG) {
        return ___call(fun, name, that, args);
    } else {
        return fun.apply(that, args);
    }
}

export function getNextId(threadId: string): string {
    if (DEBUG) { return ___getNextId(threadId); }
    else { return '' + Date.now(); }
}

export function stringifySafe(obj: any) {
    const seen: any[] = [];
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