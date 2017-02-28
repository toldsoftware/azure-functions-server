"use strict";
var tslib_1 = require("tslib");
var http = require("http");
var url = require("url");
var querystring = require("querystring");
var path = require("path");
var resource_1 = require("./resource");
var root_dir_1 = require("./../src/root-dir");
var call_tree_1 = require("../src-cli/injectors/call-tree");
var promise_wrapper_1 = require("../src-cli/injectors/promise-wrapper");
var _callTreeRoot = null;
if (call_tree_1.DEBUG) {
    promise_wrapper_1._injectPromiseWrapper();
    _callTreeRoot = call_tree_1.getCallTree();
}
function setDirName(dirName) {
    root_dir_1.dir.rootDir = path.resolve(dirName, '..');
    return this;
}
exports.setDirName = setDirName;
function serve(functions, port) {
    if (port === void 0) { port = 8765; }
    console.log('Server Started at http://localhost:' + port);
    http.createServer(function (req, res) {
        console.log('rootDir=', root_dir_1.dir.rootDir, '__dirname=', __dirname);
        var uri = url.parse(req.url);
        var query = querystring.parse(uri.query);
        var content = '';
        req.on('data', function (chunk) { return content += chunk; });
        req.on('end', function () {
            var body = content;
            // Auto-Parse Json
            if (typeof body === 'string') {
                var orig = body;
                try {
                    body = JSON.parse(body);
                }
                catch (err) {
                    body = orig;
                }
            }
            console.log('START Request:', 'query', query, 'body', body);
            var context = {
                log: function (m) {
                    var x = [];
                    for (var _i = 1; _i < arguments.length; _i++) {
                        x[_i - 1] = arguments[_i];
                    }
                    return console.log.apply(console, [m].concat(x));
                },
                done: function (err, r) {
                    if (err) {
                        console.error(err);
                        res.writeHead(500, { 'Content-Type': 'text/plain' });
                        res.end('ERROR: ' + err);
                        return;
                    }
                    if (typeof r.body === 'object' && !(r.body instanceof Buffer)) {
                        r.body = JSON.stringify(r.body);
                    }
                    res.writeHead(r.status || 200, r.headers || { 'Content-Type': 'text/plain' });
                    res.end(r.body);
                    console.log('END Request:', r.body);
                }
            };
            // Process Request
            var request = {
                query: query, body: body,
                pathName: uri.pathname || '',
                pathParts: uri.pathname.split('/').filter(function (p) { return p.length > 0; }),
                headers: tslib_1.__assign({
                    Cookie: process.env.cookie || undefined
                }, req.headers)
            };
            if (request.pathParts.length === 0) {
                request.query.name = 'test-main.html';
                resource_1.main(context, request).then();
            }
            else if (request.pathParts[0] === 'resources') {
                request.pathName = request.pathName
                    .replace('/resources/', '/')
                    .replace('resources/', '');
                request.pathParts.splice(0, 1);
                resource_1.main(context, request).then();
            }
            else if (functions.filter(function (x) { return x.name === request.pathParts[0]; }).length > 0) {
                var f = functions.filter(function (x) { return x.name === request.pathParts[0]; })[0];
                request.pathName = request.pathName.replace("/" + f.name + "/", '/').replace(f.name + "/", '').replace("" + f.name, '');
                request.pathParts.splice(0, 1);
                try {
                    var _callTree_requestRoot_1 = _callTreeRoot;
                    call_tree_1.setCallTree(_callTree_requestRoot_1);
                    f.main(context, request)
                        .then(function () {
                        if (_callTree_requestRoot_1) {
                            console.log(call_tree_1._printCallTree(_callTree_requestRoot_1));
                        }
                    })
                        .catch(function (err) { return console.error(err); });
                }
                catch (err) {
                    console.error(err);
                }
            }
            else {
                context.done('Unknown Request', null);
            }
        });
    }).listen(port);
}
exports.serve = serve;
//# sourceMappingURL=test-main.js.map