"use strict";
var tslib_1 = require("tslib");
var fs = require('fs');
var p = require('path');
function main(context, request) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var filePath, path;
        return tslib_1.__generator(this, function (_a) {
            filePath = request.query.name || request.pathName.replace(/\/$/, '').replace(/\/(file)$/, '');
            path = p.resolve(__dirname, '..', 'resources', filePath);
            context.log('filePath=' + filePath + ' path=' + path + ' request.query.name=' + request.query.name + ' request.pathName=' + request.pathName);
            fs.readFile(path, function (err, data) {
                context.log('path=' + path);
                if (err != null) {
                    context.log('ERROR: ' + err);
                    context.done(null, {
                        status: 404,
                        headers: {
                            'Content-Type': 'text/plain',
                        },
                        body: ('File Not Found: ' + filePath)
                    });
                    return;
                }
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
                if (path.match('\.ico$')) {
                    type = 'image/x-icon';
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
//# sourceMappingURL=example-function-resource.1.js.map