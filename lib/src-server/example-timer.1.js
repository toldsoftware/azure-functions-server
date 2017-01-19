"use strict";
var tslib_1 = require("tslib");
// schedule: 0 */1 * * * *
function tick(context, timer) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var timeStamp;
        return tslib_1.__generator(this, function (_a) {
            timeStamp = new Date().toISOString();
            if (timer.isPastDue) {
                console.log('Timer is Past Due');
            }
            context.log('Timer ran!', timeStamp);
            context.done();
            return [2 /*return*/];
        });
    });
}
exports.tick = tick;
//# sourceMappingURL=example-timer.1.js.map