"use strict";
function _printCallTree(callTree, depth) {
    if (depth === void 0) { depth = 0; }
    var text = '';
    for (var d = 0; d < depth; d++) {
        text += '-';
    }
    if (!callTree.err) {
        text += callTree.name + " " + callTree.id + ": " + abbreviate(callTree.args || '{}') + " => " + abbreviate(callTree.result || '{}');
    }
    else {
        text += "ERROR " + callTree.name + " " + callTree.id + ": " + callTree.args + " => " + callTree.err;
    }
    text += '\r\n';
    for (var _i = 0, _a = callTree.calls; _i < _a.length; _i++) {
        var c = _a[_i];
        text += _printCallTree(c, depth + 1);
    }
    return text;
}
exports._printCallTree = _printCallTree;
function abbreviate(text, maxLength) {
    if (maxLength === void 0) { maxLength = 80; }
    if (text.length <= maxLength) {
        return text;
    }
    return text.substr(0, maxLength) + '...';
}
//# sourceMappingURL=call-tree.js.map