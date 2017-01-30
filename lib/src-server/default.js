"use strict";
var tslib_1 = require("tslib");
var R = require("./resource");
function main(context, request) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // Serve index.html as the default file
                    request.query.name = 'index.html';
                    return [4 /*yield*/, R.main(context, request, 0)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.main = main;
//# sourceMappingURL=default.js.map