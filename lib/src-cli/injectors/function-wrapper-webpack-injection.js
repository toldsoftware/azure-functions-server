"use strict";
function injectFunctionWrapper(webpackSource, ownSourceCode) {
    // Only wrap functions, not constructors
    return globals +
        webpackSource.replace(/\nfunction\s+([^_][^\()]+)\(/g, function (whole, name) { return isClassName(name) || hasPrototype(webpackSource, name) || !isOwnSourceCode(ownSourceCode, name) ? whole : getFunctionWrapper(name); });
}
exports.injectFunctionWrapper = injectFunctionWrapper;
function isOwnSourceCode(ownSourceCode, name) {
    // is declared in own source code
    // return ownSourceCode.indexOf('function ' + name) >= 0;
    // is called in own source code
    return ownSourceCode.indexOf(name + '(') >= 0;
}
function hasPrototype(webpackSource, name) {
    return webpackSource.indexOf(name + '.prototype') >= 0;
}
function isClassName(name) {
    return name[0] === name[0].toUpperCase();
}
function getFunctionWrapper(name) {
    return functionWrapper.replace(/\$1/g, name);
}
var globals = "\nvar ___nextId = ___nextId || 0;\nvar ___process = process || '_NO_PROCESS_';\nfunction ___getNextId(threadId) {\n    return ___process.pid + '_' + threadId + '_' + ___nextId++;\n}\nvar ___tempThreadId = '' + Math.floor(Math.random() * 10000);\nvar ___callTree = { name: '_root', id: ___getNextId(___tempThreadId), threadId: ___tempThreadId, args: '', parent: null, calls: [] };\nvar ___log = [];\nvar ___beforeFunctionCallback = function (name, args) {\n    ___callTree = { name: name, id: ___getNextId(___callTree.threadId), threadId: ___callTree.threadId, args: ___stringifySafe(args), parent: ___callTree, calls: [] };\n    ___callTree.parent.calls.push(___callTree);\n    return -1 + ___log.push(___callTree);\n}\nvar ___afterFunctionCallback = function (iLog, name, result, err) {\n    ___log[iLog].result = ___stringifySafe(result);\n    ___log[iLog].err = ___stringifySafe(err);\n    ___callTree = ___callTree.parent;\n}\nfunction ___call(fun, name, that, args) {\n    var iLog = ___beforeFunctionCallback(name, args);\n    try {\n        var result = fun.apply(that, args);\n        ___afterFunctionCallback(iLog, name, result);\n        return result;\n    } catch (err) {\n        ___afterFunctionCallback(iLog, name, null, err);\n        throw err;\n    }\n}\n\nfunction ___stringifySafe(obj) {\n    let seen = [];\n    return JSON.stringify(obj, function (key, val) {\n        if (val != null && typeof val === 'object') {\n            if (seen.indexOf(val) >= 0\n                || key === 'parent'\n                || key === 'context'\n            ) {\n                return;\n            }\n            seen.push(val);\n        } else if (val != null && typeof val === 'string' && val.length > 40) {\n            return val.substr(0, 40) + '...';\n        }\n\n        return val;\n    });\n}\n";
var functionWrapper = "\nfunction $1(){ return ___call(___$1,'$1',this,arguments); }\nfunction ___$1(";
//# sourceMappingURL=function-wrapper-webpack-injection.js.map