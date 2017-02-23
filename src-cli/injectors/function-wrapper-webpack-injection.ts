export function injectFunctionWrapper(webpackSource: string, ownSourceCode: string) {
    return globals + webpackSource
        // simple functions at beginning of file (not constructors)
        // function name(...)
        .replace(new RegExp(`(\\n)function\\s+(${nameRegex})\\s*\\(`, 'g'), (whole, prefix, name) =>
            isUtilityName(name) || isClassName(name) || hasPrototype(webpackSource, name) || !isOwnSourceCode(ownSourceCode, name)
                ? whole
                : `
function ${name}(){ return ___call(_f_${name},'${name}',this,arguments); }
function _f_${name}(`)
        // exported functions:
        // exports.createBlobServiceWithSas = function (host, sasToken) {
        //   return new BlobService(null, null, host, sasToken);
        // };
        .replace(new RegExp(`(\\n)exports\\.(${nameRegex})\\s*=\\s*function\\s*\\(`, 'g'), (whole, prefix, name) =>
            isUtilityName(name) || isClassName(name) || hasPrototype(webpackSource, name) || !isOwnSourceCode(ownSourceCode, name)
                ? whole
                : `
exports.${name} = function(){ return ___call(_f_${name},'${name}',this,arguments); }
function _f_${name}(`)
        // constructors:
        // var TestClass = (function () {
        //     function TestClass(a, b, c) {
        //         this.c = c;
        //         this.val = 0;
        //         this.val = a + b;
        //     }
        //     TestClass.prototype.testMethod = function () {
        //         return this.val;
        //     };
        //     return TestClass;
        // }());
        .replace(new RegExp(`(\\n\\s*)return\\s+(${nameRegex})\\s*;\\s*}\\(\\)\\);`, 'g'), (whole, prefix, name) =>
            isUtilityName(name) || !isClassName(name) || !hasPrototype(webpackSource, name) || !isOwnSourceCode(ownSourceCode, name)
                ? whole
                : `
return function(){ return ___wrapMethods(${name}(arguments)); };
}());`);
    ;
}

const nameRegex = '[a-zA-Z_][a-zA-Z_0-9]*';

function isOwnSourceCode(ownSourceCode: string, name: string) {
    // is declared in own source code
    // return ownSourceCode.indexOf('function ' + name) >= 0;

    // is called in own source code
    return ownSourceCode.match(new RegExp(`[^a-zA-Z_0-9]${name}\\s*\\(`));
}

function hasPrototype(webpackSource: string, name: string) {
    return webpackSource.indexOf(name + '.prototype') >= 0;
}

function isClassName(name: string) {
    return name[0] === name[0].toUpperCase();
}

function isUtilityName(name: string) {
    return name[0] === '_';
}

const globals = `
var ___nextId = ___nextId || 0;
var ___process = process || '_NO_PROCESS_';
var ___threadId = '' + Math.floor(Math.random() * 10000);

function ___getNextId(parentThreadId) {
    return ___process.pid + '_' + ___threadId + '_' + parentThreadId + '_' + ___nextId++;
}
var ___callTree = { name: '_root', id: ___getNextId(___threadId), threadId: ___threadId, args: '', parent: null, calls: [] };
var ___log = [];
var ___beforeFunctionCallback = function (name, args) {
    ___callTree = { name: name, id: ___getNextId(___callTree.threadId), threadId: ___callTree.threadId, args: ___stringifySafe(args), parent: ___callTree, calls: [] };
    ___callTree.parent.calls.push(___callTree);
    return -1 + ___log.push(___callTree);
}
var ___afterFunctionCallback = function (iLog, name, result, err) {
    ___log[iLog].result = ___stringifySafe(result);
    ___log[iLog].err = ___stringifySafe(err);
    ___callTree = ___callTree.parent;
}
function ___call(fun, name, that, args) {
    var iLog = ___beforeFunctionCallback(name, args);
    try {
        var result = fun.apply(that, args);
        ___afterFunctionCallback(iLog, name, result);
        return result;
    } catch (err) {
        ___afterFunctionCallback(iLog, name, null, err);
        throw err;
    }
}

function ___wrapMethods(inner) {
    let outer = Object.create(inner);

    for (var key in inner) {
        if (inner.hasOwnProperty(key) && typeof inner[key] === 'function') {
            outer[key] = function () { return ___call(inner[key], key, inner, arguments); }
        }
    }

    return outer;
}

function ___stringifySafe(obj) {
    let seen = [];
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

`;