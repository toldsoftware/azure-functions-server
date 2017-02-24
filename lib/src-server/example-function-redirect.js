"use strict";
var tslib_1 = require("tslib");
function main(context, request) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var redirectUrl;
        return tslib_1.__generator(this, function (_a) {
            redirectUrl = 'example-function';
            context.done(null, {
                status: 303,
                headers: {
                    'Location': redirectUrl,
                    'Content-Type': 'text/html',
                },
                body: "<html><head></head><body>Redirect</body></html>",
            });
            return [2 /*return*/];
        });
    });
}
exports.main = main;
//# sourceMappingURL=example-function-redirect.js.map