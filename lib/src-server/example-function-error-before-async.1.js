"use strict";
var tslib_1 = require("tslib");
function main(context, request) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
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
        });
    });
}
exports.main = main;
//# sourceMappingURL=example-function-error-before-async.1.js.map