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
        .replace(new RegExp("(\\n\\s*)return\\s+(" + nameRegex + ")\\s*;\\s*}\\(", 'g'), function (whole, prefix, name) {
        return isUtilityName(name) || !isClassName(name) || !hasPrototype(webpackSource, name) || !isOwnSourceCode(ownSourceCode, name)
            ? whole
            : "\nreturn ___wrapConstructor(" + name + ", '" + name + "');\n}(";
    })
        .replace('//# sourceMappingURL=', '// DISABLED source Mapping URL=');
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
// function testForClosure() {
//     let inner, ___call, constructorInner, proto;
//     function ___wrapMethods(inner) {
//         let outer = Object.create(inner);
//         var loop = function (key) {
//             if (inner.hasOwnProperty(key) && typeof inner[key] === 'function') {
//                 outer[key] = function () { return ___call(inner[key], key, inner, arguments); }
//             }
//         };
//         for (let key in inner) {
//             loop(key);
//         }
//         return outer;
//     }
//     function Outer() {
//         constructorInner.apply(this, arguments);
//         var loop = function (key) {
//             if (proto.hasOwnProperty(key) && typeof proto[key] === 'function') {
//                 this[key] = function () {
//                     return ___call(proto[key], name + '.' + key, this, arguments);
//                 }
//             }
//         };        
//         for (let key in proto) {
//             loop(key);
//         }
//     }
// }
// function ___wrapMethods(inner) {
//     var outer = Object.create(inner);
//     var loop = function(key){
//         if (inner.hasOwnProperty(key) && typeof inner[key] === 'function') {
//             outer[key] = function () { return ___call(inner[key], key, inner, arguments); }
//         }
//     };
//     for (var key in inner) {
//         loop(key);
//     }
//     return outer;
// }
var globals = "\nvar ___nextId = ___nextId || 0;\nvar ___process = process || '_NO_PROCESS_';\nvar ___threadId = '' + Math.floor(Math.random() * 10000);\n\nfunction ___getNextId(parentThreadId) {\n    return ___process.pid + '_' + ___threadId + '_' + ___nextId++;\n}\nvar ___callTree = { name: '_root', id: ___getNextId(___threadId), threadId: ___threadId, args: '', parent: null, calls: [] };\nvar ___log = [];\nvar ___beforeFunctionCallback = function (name, args) {\n    ___callTree = { name: name, id: ___getNextId(___callTree.threadId), threadId: ___callTree.threadId, args: ___stringifySafe(args), parent: ___callTree, calls: [] };\n    ___callTree.parent.calls.push(___callTree);\n    return -1 + ___log.push(___callTree);\n}\nvar ___afterFunctionCallback = function (iLog, name, result, err) {\n    ___log[iLog].result = ___stringifySafe(result);\n    ___log[iLog].err = ___stringifySafe(err);\n    ___callTree = ___callTree.parent;\n}\nfunction ___call(fun, name, that, args) {\n    var iLog = ___beforeFunctionCallback(name, args);\n    try {\n        var result = fun.apply(that, args);\n        ___afterFunctionCallback(iLog, name, result);\n        return result;\n    } catch (err) {\n        ___afterFunctionCallback(iLog, name, null, err);\n        throw err;\n    }\n}\n\n// http://stackoverflow.com/questions/10101508/how-do-i-wrap-a-constructor\nfunction ___wrapConstructor(constructorInner, name) {\n\n    var proto = constructorInner.prototype;\n    var inner = (function(p) {\n        function f() {};\n        f.prototype = p.prototype;\n        return new f;\n    })(proto);\n\n    function Outer() {\n        constructorInner.apply(this, arguments);\n        let that = this;\n\n        var loop = function(key){\n            if (proto.hasOwnProperty(key) && typeof proto[key] === 'function') {\n                that[key] = function () { \n                    return ___call(proto[key], name + '.' + key, that, arguments); \n                }\n            }\n        };\n\n        for (var key in proto) {\n            loop(key);\n        }\n    }\n\n    Outer.prototype = inner;\n    return Outer;\n};\n\nfunction ___stringifySafe(obj) {\n    var seen = [];\n    return JSON.stringify(obj, function (key, val) {\n        if (val != null && typeof val === 'object') {\n            if (seen.indexOf(val) >= 0\n                || key === 'parent'\n                || key === 'context'\n            ) {\n                return;\n            }\n            seen.push(val);\n        } else if (val != null && typeof val === 'string' && val.length > 40) {\n            return val.substr(0, 40) + '...';\n        }\n\n        return val;\n    });\n}\n\n";
//# sourceMappingURL=function-wrapper-webpack-injection.js.map