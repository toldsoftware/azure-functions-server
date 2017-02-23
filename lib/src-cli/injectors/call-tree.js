"use strict";
function _printCallTree(callTree, depth) {
    if (depth === void 0) { depth = 0; }
    var text = '';
    for (var d = 0; d < depth; d++) {
        text += '-';
    }
    if (!callTree.err) {
        text += callTree.name + ": " + (callTree.args || '{}') + " => " + (callTree.result || '{}');
    }
    else {
        text += "ERROR " + callTree.name + ": " + callTree.args + " => " + callTree.err;
    }
    text += '\r\n';
    for (var _i = 0, _a = callTree.calls; _i < _a.length; _i++) {
        var c = _a[_i];
        text += _printCallTree(c, depth + 1);
    }
    return text;
}
exports._printCallTree = _printCallTree;
function _stringifySafe(obj) {
    var seen = [];
    return JSON.stringify(obj, function (key, val) {
        if (val != null && typeof val === 'object') {
            if (seen.indexOf(val) >= 0
                || key === 'parent'
                || key === 'context') {
                return;
            }
            seen.push(val);
        }
        else if (val != null && typeof val === 'string' && val.length > 40) {
            return val.substr(0, 40) + '...';
        }
        return val;
    });
}
exports._stringifySafe = _stringifySafe;
//# sourceMappingURL=call-tree.js.map