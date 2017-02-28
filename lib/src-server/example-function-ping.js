"use strict";
var tslib_1 = require("tslib");
function main(context, request) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var response;
        return tslib_1.__generator(this, function (_a) {
            response = {
                body: request.body,
                headers: request.headers,
                path: request.pathName,
                query: request.query
            };
            context.log('Request=', response);
            context.done(null, {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {
                    ok: true,
                    data: response
                },
            });
            return [2 /*return*/];
        });
    });
}
exports.main = main;
//# sourceMappingURL=example-function-ping.js.map