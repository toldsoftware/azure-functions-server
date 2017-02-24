"use strict";
var tslib_1 = require("tslib");
function main(context, request) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var obj, val, sub, stat, result, v;
        return tslib_1.__generator(this, function (_a) {
            obj = new TestClass(1, 2, 7);
            val = obj.testMethod();
            sub = new TestSubClass(1, 2, 7);
            sub.testMethod();
            sub.testMethod2();
            stat = new TestStaticClass();
            result = TestStaticClass.method();
            v = TestStaticClass.val;
            context.done(null, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json',
                    'X-Told-Test-Header': 'test-header',
                },
                body: {
                    ok: true,
                    data: { text: 'Value: ' + val },
                }
            });
            return [2 /*return*/];
        });
    });
}
exports.main = main;
var TestClass = (function () {
    function TestClass(a, b, c) {
        this.c = c;
        this.val = 0;
        this.val = a + b;
    }
    TestClass.prototype.testMethod = function () {
        return "a+b=" + this.val + "; this.c=" + this.c;
    };
    return TestClass;
}());
exports.TestClass = TestClass;
var TestSubClass = (function (_super) {
    tslib_1.__extends(TestSubClass, _super);
    function TestSubClass(a, b, c) {
        return _super.call(this, a, b, c) || this;
    }
    TestSubClass.prototype.testMethod2 = function () {
        return "a+b=" + this.val + "; this.c=" + this.c;
    };
    return TestSubClass;
}(TestClass));
exports.TestSubClass = TestSubClass;
var TestStaticClass = (function () {
    function TestStaticClass() {
    }
    TestStaticClass.method = function () {
        return TestStaticClass.val;
    };
    return TestStaticClass;
}());
TestStaticClass.val = 0;
exports.TestStaticClass = TestStaticClass;
//# sourceMappingURL=example-function-class.js.map