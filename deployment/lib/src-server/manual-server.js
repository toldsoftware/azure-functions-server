"use strict";
var http = require('http');
var url = require('url');
var queryString = require('querystring');
// let jsonparse = require("jsonparse");
function serve(main, port) {
    if (port === void 0) { port = 9876; }
    console.log('Server Started at http://localhost:' + port);
    http.createServer(function (req, res) {
        var uri = url.parse(req.url);
        var query = queryString.parse(uri.query);
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
                done: function (u, r) {
                    res.writeHead(r.status || 200, r.headers || { 'Content-Type': 'text/plain' });
                    res.end(JSON.stringify(r.body));
                    console.log('END Request:', r.body);
                }
            };
            main(context, { query: query, body: JSON.parse(req.body || '{}'), pathName: uri.pathName || '', pathParts: uri.pathName.split('/').filter(function (p) { return p.length > 0; }) })
                .then(function () { })
                .catch(function (err) { return console.error(err); });
        });
    }).listen(port);
}
exports.serve = serve;
//# sourceMappingURL=manual-server.js.map