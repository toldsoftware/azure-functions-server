"use strict";
function _printCallTree(callTree, depth) {
    if (depth === void 0) { depth = 0; }
    var text = '';
    for (var d = 0; d < depth; d++) {
        text += '-';
    }
    if (!callTree.err) {
        text += callTree.name + " " + callTree.id + ": " + _abbreviate(callTree.args || '{}') + " => " + _abbreviate(callTree.result || '{}');
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
function _abbreviate(text, maxLength) {
    if (maxLength === void 0) { maxLength = 255; }
    if (text.length <= maxLength) {
        return text;
    }
    return text.substr(0, maxLength) + '...';
}
// export function _ensureGlobalExists<T>(name: string, getDefault: () => T): T {
//     return _global()[name] = _global()[name] || getDefault();
// }
exports.DEBUG = typeof ___callTree !== 'undefined';
function getCallTree() {
    if (exports.DEBUG) {
        return ___callTree;
    }
    else {
        return { calls: [] };
    }
}
exports.getCallTree = getCallTree;
function setCallTree(value) {
    if (exports.DEBUG) {
        ___callTree = value;
    }
}
exports.setCallTree = setCallTree;
function callFunction(fun, name, that, args) {
    if (exports.DEBUG) {
        return ___call(fun, name, that, args);
    }
    else {
        return fun.apply(that, args);
    }
}
exports.callFunction = callFunction;
function getNextId(threadId) {
    if (exports.DEBUG) {
        return ___getNextId(threadId);
    }
    else {
        return '' + Date.now();
    }
}
exports.getNextId = getNextId;
function stringifySafe(obj) {
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
exports.stringifySafe = stringifySafe;
//# sourceMappingURL=call-tree.js.map