"use strict";
var tslib_1 = require("tslib");
var http = require('http');
var https = require('https');
// schedule: 0 0 0 * * *
function tick(context, timer) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var urls, doneCount, callDone, _loop_1, _i, urls_1, x, timeStamp;
        return tslib_1.__generator(this, function (_a) {
            urls = [
                'https://told-azure-functions-server-test.azurewebsites.net/api/example-function-get-blob',
                'https://azure-blob-access-test.azurewebsites.net/api/get-blob',
            ];
            doneCount = 0;
            callDone = function (url) {
                doneCount++;
                context.log('Keep Alive END: ', url);
                if (doneCount >= urls.length) {
                    context.done();
                }
            };
            _loop_1 = function (x) {
                context.log('Keep Alive START: ', x);
                var http_s = http;
                if (x.match(/^https/)) {
                    http_s = https;
                }
                http_s.get(x, function (res) {
                    console.log('statusCode:', res.statusCode);
                    callDone(x);
                });
            };
            for (_i = 0, urls_1 = urls; _i < urls_1.length; _i++) {
                x = urls_1[_i];
                _loop_1(x);
            }
            timeStamp = new Date().toISOString();
            if (timer.isPastDue) {
                context.log('Timer is Past Due');
            }
            context.log('Timer started!', timeStamp);
            return [2 /*return*/];
        });
    });
}
exports.tick = tick;
//# sourceMappingURL=example-timer-keep-alive.js.map