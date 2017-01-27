"use strict";
var http = require("http");
var url = require("url");
var querystring = require("querystring");
var example_function_resource_1 = require("./example-function-resource");
function serve(functions, port) {
    if (port === void 0) { port = 8765; }
    console.log('Server Started at http://localhost:' + port);
    http.createServer(function (req, res) {
        console.log('__dirname=', __dirname);
        var uri = url.parse(req.url);
        var query = querystring.parse(uri.query);
        var content = '';
        req.on('data', function (chunk) { return content += chunk; });
        req.on('end', function () {
            var body = JSON.parse(content.length > 0 ? content : '{}');
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
            var request = { query: query, body: JSON.parse(req.body || '{}'), pathName: uri.pathname || '', pathParts: uri.pathname.split('/').filter(function (p) { return p.length > 0; }), headers: {} };
            if (request.pathParts.length === 0) {
                request.query.name = '../deployment/resources/test-main.html';
                example_function_resource_1.main(context, request).then();
            }
            else if (request.pathParts[0] === 'resources' || request.pathParts[0] === 'example-function-resource') {
                request.pathName = request.pathName
                    .replace('/resources/', '../deployment/resources/')
                    .replace('resources/', '../deployment/resources/')
                    .replace('/example-function-resource/', '../deployment/resources/')
                    .replace('example-function-resource/', '../deployment/resources/');
                request.pathParts.splice(0, 1);
                example_function_resource_1.main(context, request).then();
            }
            else if (functions.filter(function (x) { return x.name === request.pathParts[0]; }).length > 0) {
                var f = functions.filter(function (x) { return x.name === request.pathParts[0]; })[0];
                request.pathName = request.pathName.replace("/" + f.name + "/", '/').replace(f.name + "/", '').replace("" + f.name, '');
                request.pathParts.splice(0, 1);
                try {
                    f.main(context, request)
                        .then(function () { })
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