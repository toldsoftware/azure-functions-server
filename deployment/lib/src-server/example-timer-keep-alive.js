"use strict";
var tslib_1 = require("tslib");
var http = require('http');
var https = require('https');
// schedule: 0 0 0 * * *
function tick(context, timer) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var urls, urlParts, _i, urlParts_1, x, timeStamp;
        return tslib_1.__generator(this, function (_a) {
            urls = [
                'https://azure-blob-access-test.azurewebsites.net/api/get-blob',
                'https://told-azure-functions-server-test.azurewebsites.net/api/example-function-get-blob',
            ];
            urlParts = urls.map(function (x) {
                var m = x.match(/(https?):\/\/(.*)\/(.*)/);
                return {
                    raw: x,
                    https: m[1] === 'https',
                    host: m[2],
                    path: m[3]
                };
            });
            for (_i = 0, urlParts_1 = urlParts; _i < urlParts_1.length; _i++) {
                x = urlParts_1[_i];
                context.log('Keep Alive: ', x.raw);
                if (x.https) {
                    https(x);
                }
                else {
                    http(x);
                }
            }
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
//# sourceMappingURL=example-timer-keep-alive.js.map