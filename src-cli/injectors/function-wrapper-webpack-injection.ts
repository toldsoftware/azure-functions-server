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
        //         return "a+b=" + this.val + "; this.c=" + this.c;
        //     };
        // return TestClass;
        // }());
        // exports.TestClass = TestClass;
        // var TestSubClass = (function (_super) {
        //     tslib_1.__extends(TestSubClass, _super);
        //     function TestSubClass(a, b, c) {
        //         return _super.call(this, a, b, c) || this;
        //     }
        //     TestSubClass.prototype.testMethod2 = function () {
        //         return "a+b=" + this.val + "; this.c=" + this.c;
        //     };
        //     return TestSubClass;
        // }(TestClass));
        // exports.TestSubClass = TestSubClass;
        .replace(new RegExp(`(\\n\\s*)return\\s+(${nameRegex})\\s*;\\s*}\\(`, 'g'), (whole, prefix, name) =>
            isUtilityName(name) || !isClassName(name) || !hasPrototype(webpackSource, name) || !isOwnSourceCode(ownSourceCode, name)
                ? whole
                : `
return ___wrapConstructor(${name}, '${name}');
}(`)
        // Disable Source Map (globals mess it up)
        .replace('//# sourceMappingURL=', '// DISABLED source Mapping URL=')
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

const globals = `
var ___nextId = ___nextId || 0;
var ___process = process || '_NO_PROCESS_';
var ___threadId = '' + Math.floor(Math.random() * 10000);

function ___getNextId(parentThreadId) {
    return ___process.pid + '_' + ___threadId + '_' + ___nextId++;
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
    var outer = Object.create(inner);

    var loop = function(key){
        if (inner.hasOwnProperty(key) && typeof inner[key] === 'function') {
            outer[key] = function () { return ___call(inner[key], key, inner, arguments); }
        }
    };

    for (var key in inner) {
        loop(key);
    }

    return outer;
}

// http://stackoverflow.com/questions/10101508/how-do-i-wrap-a-constructor
function ___wrapConstructor(constructorInner, name) {

    var proto = constructorInner.prototype;
    var inner = (function(p) {
        function f() {};
        f.prototype = p.prototype;
        return new f;
    })(proto);

    function Outer() {
        constructorInner.apply(this, arguments);

        var loop = function(key){
            if (proto.hasOwnProperty(key) && typeof proto[key] === 'function') {
                this[key] = function () { 
                    return ___call(proto[key], name + '.' + key, this, arguments); 
                }
            }
        };

        for (var key in proto) {
            loop(key);
        }
    }

    Outer.prototype = inner;
    return Outer;
};

function ___stringifySafe(obj) {
    var seen = [];
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