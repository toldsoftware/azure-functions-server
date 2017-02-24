"use strict";
var tslib_1 = require("tslib");
function main(context, request) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, delay()];
                case 1:
                    _a.sent();
                    if (!!true) {
                        throw 'TEST ERROR';
                    }
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
function delay(time) {
    if (time === void 0) { time = 10; }
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve();
        }, time);
    });
}
//# sourceMappingURL=example-function-error-after-async.js.map