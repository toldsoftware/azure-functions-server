"use strict";
var tslib_1 = require("tslib");
function main(context, request) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var obj, val;
        return tslib_1.__generator(this, function (_a) {
            obj = new TestClass(1, 2, 7);
            val = obj.testMethod();
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
//# sourceMappingURL=example-function-class.js.map