"use strict";
var tslib_1 = require("tslib");
var fs = require('fs');
var p = require('path');
function main(context, request) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var path;
        return tslib_1.__generator(this, function (_a) {
            path = p.resolve(__dirname, '..', 'resources', request.query.name);
            fs.readFile(path, function (err, data) {
                context.log('path=' + path + ' err=' + err);
                var body = data;
                var type = 'application/javascript';
                if (path.match('\.jpg$')) {
                    type = 'image/jpg';
                }
                if (path.match('\.png$')) {
                    type = 'image/png';
                }
                if (path.match('\.html$')) {
                    type = 'text/html';
                }
                context.done(null, {
                    headers: {
                        'Content-Type': type,
                    },
                    body: body
                });
            });
            return [2 /*return*/];
        });
    });
}
exports.main = main;
//# sourceMappingURL=example-function-resource.js.map