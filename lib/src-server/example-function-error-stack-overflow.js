"use strict";
var tslib_1 = require("tslib");
function main(context, request) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var x, recursive;
        return tslib_1.__generator(this, function (_a) {
            x = [10];
            recursive = function () {
                var y = x = x.concat(10);
                return y.concat(recursive()).concat(recursive());
            };
            recursive();
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
//# sourceMappingURL=example-function-error-stack-overflow.js.map