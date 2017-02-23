"use strict";
function injectFunctionWrapper(webpackSource, ownSourceCode) {
    return globals + webpackSource
        .replace(new RegExp("(\\n)function\\s+(" + nameRegex + ")\\s*\\(", 'g'), function (whole, prefix, name) {
        return isUtilityName(name) || isClassName(name) || hasPrototype(webpackSource, name) || !isOwnSourceCode(ownSourceCode, name)
            ? whole
            : "\nfunction " + name + "(){ return ___call(_f_" + name + ",'" + name + "',this,arguments); }\nfunction _f_" + name + "(";
    })
        .replace(new RegExp("(\\n)exports\\.(" + nameRegex + ")\\s*=\\s*function\\s*\\(", 'g'), function (whole, prefix, name) {
        return isUtilityName(name) || isClassName(name) || hasPrototype(webpackSource, name) || !isOwnSourceCode(ownSourceCode, name)
            ? whole
            : "\nexports." + name + " = function(){ return ___call(_f_" + name + ",'" + name + "',this,arguments); }\nfunction _f_" + name + "(";
    })
        .replace(new RegExp("(\\n\\s*)return\\s+(" + nameRegex + ")\\s*;\\s*}\\(\\)\\);", 'g'), function (whole, prefix, name) {
        return isUtilityName(name) || !isClassName(name) || !hasPrototype(webpackSource, name) || !isOwnSourceCode(ownSourceCode, name)
            ? whole
            : "\nreturn function(){ return ___wrapMethods(" + name + ".apply(this,arguments)); };\n}());";
    });
    ;
}
exports.injectFunctionWrapper = injectFunctionWrapper;
var nameRegex = '[a-zA-Z_][a-zA-Z_0-9]*';
function isOwnSourceCode(ownSourceCode, name) {
    // is declared in own source code
    // return ownSourceCode.indexOf('function ' + name) >= 0;
    // is called in own source code
    return ownSourceCode.match(new RegExp("[^a-zA-Z_0-9]" + name + "\\s*\\("));
}
function hasPrototype(webpackSource, name) {
    return webpackSource.indexOf(name + '.prototype') >= 0;
}
function isClassName(name) {
    return name[0] === name[0].toUpperCase();
}
function isUtilityName(name) {
    return name[0] === '_';
}
var globals = "\nvar ___nextId = ___nextId || 0;\nvar ___process = process || '_NO_PROCESS_';\nvar ___threadId = '' + Math.floor(Math.random() * 10000);\n\nfunction ___getNextId(parentThreadId) {\n    return ___process.pid + '_' + ___threadId + '_' + parentThreadId + '_' + ___nextId++;\n}\nvar ___callTree = { name: '_root', id: ___getNextId(___threadId), threadId: ___threadId, args: '', parent: null, calls: [] };\nvar ___log = [];\nvar ___beforeFunctionCallback = function (name, args) {\n    ___callTree = { name: name, id: ___getNextId(___callTree.threadId), threadId: ___callTree.threadId, args: ___stringifySafe(args), parent: ___callTree, calls: [] };\n    ___callTree.parent.calls.push(___callTree);\n    return -1 + ___log.push(___callTree);\n}\nvar ___afterFunctionCallback = function (iLog, name, result, err) {\n    ___log[iLog].result = ___stringifySafe(result);\n    ___log[iLog].err = ___stringifySafe(err);\n    ___callTree = ___callTree.parent;\n}\nfunction ___call(fun, name, that, args) {\n    var iLog = ___beforeFunctionCallback(name, args);\n    try {\n        var result = fun.apply(that, args);\n        ___afterFunctionCallback(iLog, name, result);\n        return result;\n    } catch (err) {\n        ___afterFunctionCallback(iLog, name, null, err);\n        throw err;\n    }\n}\n\nfunction ___wrapMethods(inner) {\n    let outer = Object.create(inner);\n\n    for (var key in inner) {\n        if (inner.hasOwnProperty(key) && typeof inner[key] === 'function') {\n            outer[key] = function () { return ___call(inner[key], key, inner, arguments); }\n        }\n    }\n\n    return outer;\n}\n\nfunction ___stringifySafe(obj) {\n    let seen = [];\n    return JSON.stringify(obj, function (key, val) {\n        if (val != null && typeof val === 'object') {\n            if (seen.indexOf(val) >= 0\n                || key === 'parent'\n                || key === 'context'\n            ) {\n                return;\n            }\n            seen.push(val);\n        } else if (val != null && typeof val === 'string' && val.length > 40) {\n            return val.substr(0, 40) + '...';\n        }\n\n        return val;\n    });\n}\n\n";
//# sourceMappingURL=function-wrapper-webpack-injection.js.map