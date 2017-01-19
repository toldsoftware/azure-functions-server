"use strict";
var tslib_1 = require("tslib");
// https://docs.microsoft.com/en-us/azure/azure-functions/functions-bindings-timer
// {second} {minute} {hour} {day} {month} {day of the week}
// schedule: 0 0 0 * * *
function tick(context, timer) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var timeStamp;
        return tslib_1.__generator(this, function (_a) {
            timeStamp = new Date().toISOString();
            if (timer.isPastDue) {
                context.log('Timer is Past Due');
            }
            context.log('Timer ran!', timeStamp);
            context.done();
            return [2 /*return*/];
        });
    });
}
exports.tick = tick;
//# sourceMappingURL=example-timer.js.map