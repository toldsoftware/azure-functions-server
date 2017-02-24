"use strict";
var tslib_1 = require("tslib");
function main(context, request) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var start, a, b, promises;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (request.query.setup) {
                        console.log('Setup was triggered');
                    }
                    start = '42';
                    return [4 /*yield*/, testManualPromise(start)];
                case 1:
                    a = _a.sent();
                    return [4 /*yield*/, testAsync(a)];
                case 2:
                    b = _a.sent();
                    promises = [testAsync(a), testAsync(a), testAsync(a)];
                    return [4 /*yield*/, Promise.all(promises)];
                case 3:
                    _a.sent();
                    context.done(null, {
                        headers: {
                            'Access-Control-Allow-Origin': '*',
                            'Content-Type': 'application/json',
                            'X-Told-Test-Header': 'test-header',
                        },
                        body: {
                            ok: true,
                            data: { text: 'Example Output' },
                        }
                    });
                    return [2 /*return*/];
            }
        });
    });
}
exports.main = main;
function testManualPromise(input) {
    console.log('testManualPromise START');
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            console.log('testManualPromise END');
            resolve(input + 'value_testManualPromise');
        }, 10);
    });
}
function testAsync(input) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('testAsync START');
                    return [4 /*yield*/, delay()];
                case 1:
                    _a.sent();
                    console.log('testAsync END');
                    return [2 /*return*/, input + 'value_testAsync'];
            }
        });
    });
}
function delay(time) {
    if (time === void 0) { time = 10; }
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve();
        }, time);
    });
}
//# sourceMappingURL=example-function-async-await.js.map