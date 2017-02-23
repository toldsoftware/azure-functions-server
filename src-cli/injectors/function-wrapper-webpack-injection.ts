export function injectFunctionWrapper(webpackSource: string, ownSourceCode: string) {
    // Only wrap functions, not constructors
    return globals +
        webpackSource.replace(/\nfunction\s+([^_][^\()]+)\(/g,
            (whole, name) => isClassName(name) || hasPrototype(webpackSource, name) || !isOwnSourceCode(ownSourceCode, name) ? whole : getFunctionWrapper(name));
}

function isOwnSourceCode(ownSourceCode: string, name: string) {
    // is declared in own source code
    // return ownSourceCode.indexOf('function ' + name) >= 0;

    // is called in own source code
    return ownSourceCode.indexOf(name + '(') >= 0;
}

function hasPrototype(webpackSource: string, name: string) {
    return webpackSource.indexOf(name + '.prototype') >= 0;
}

function isClassName(name: string) {
    return name[0] === name[0].toUpperCase();
}

function getFunctionWrapper(name: string) {
    return functionWrapper.replace(/\$1/g, name);
}

const globals = `
var ___nextId = ___nextId || 0;
function ___getNextId(threadId: number) {
    return threadId + '_' + ___nextId++;
}
var ___tempThreadId = '' + Math.floor(Math.random() * 10000);
var ___callTree = { name: '_root', id: ___getNextId(___tempThreadId), threadId: ___tempThreadId, args: '', parent: null, calls: [] };
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

const functionWrapper = `
function $1(){ return ___call(___$1,'$1',this,arguments); }
function ___$1(`;