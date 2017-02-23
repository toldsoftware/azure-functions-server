export interface CallTreeNode {
    name: string;
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
        text += `${callTree.name}: ${callTree.args || '{}'} => ${callTree.result || '{}'}`;
    } else {
        text += `ERROR ${callTree.name}: ${callTree.args} => ${callTree.err}`;
    }

    text += '\r\n';

    for (let c of callTree.calls) {
        text += _printCallTree(c, depth + 1);
    }

    return text;
}

export function _stringifySafe(obj: any) {
    let seen: any[] = [];
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