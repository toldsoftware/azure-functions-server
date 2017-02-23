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
        text += `${callTree.name} ${callTree.id}: ${abbreviate(callTree.args || '{}')} => ${abbreviate(callTree.result || '{}')}`;
    } else {
        text += `ERROR ${callTree.name} ${callTree.id}: ${callTree.args} => ${callTree.err}`;
    }

    text += '\r\n';

    for (let c of callTree.calls) {
        text += _printCallTree(c, depth + 1);
    }

    return text;
}

function abbreviate(text:string, maxLength=80){
    if(text.length<=maxLength){return text;}

    return text.substr(0,maxLength) + '...';
}