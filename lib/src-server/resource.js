"use strict";
var tslib_1 = require("tslib");
var fs = require("fs");
var Path = require("path");
var resolve_url_1 = require("./../src/resolve-url");
var root_dir_1 = require("./../src/root-dir");
function main(context, request, pathDepthFromApiRoot) {
    if (pathDepthFromApiRoot === void 0) { pathDepthFromApiRoot = 1; }
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var pathOrig, filePath, path;
        return tslib_1.__generator(this, function (_a) {
            pathOrig = request.query.name || request.pathName;
            filePath = pathOrig
                .replace(/\/$/, '')
                .replace(/\/(file)$/, '')
                .replace(/\/([^\/]+\.js\.map)$/, '.map');
            path = Path.resolve(root_dir_1.dir.rootDir, resolve_url_1.getPathDepthPrefix(pathDepthFromApiRoot - 1), 'resources', filePath.replace(/^\//, ''));
            context.log('filePath=' + filePath + ' path=' + path + ' __dirname=' + __dirname + ' request.query.name=' + request.query.name + ' request.pathName=' + request.pathName);
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
                var type = 'text/plain';
                if (path.match('\.html$')) {
                    type = 'text/html';
                }
                if (path.match('\.css$')) {
                    type = 'text/css';
                }
                if (path.match('\.js$')) {
                    type = 'application/x-javascript';
                }
                if (path.match('\.json$')) {
                    type = 'application/json';
                }
                if (path.match('\.jpg$')) {
                    type = 'image/jpeg';
                }
                if (path.match('\.png$')) {
                    type = 'image/png';
                }
                if (path.match('\.gif$')) {
                    type = 'image/gif';
                }
                if (path.match('\.ico$')) {
                    type = 'image/x-icon';
                }
                // Auto Resolve Resource Urls?
                var body = data;
                if (type === 'text/html') {
                    body = data.toString();
                    body = resolve_url_1.resolveAllUrls(body, pathDepthFromApiRoot);
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
//# sourceMappingURL=resource.js.map