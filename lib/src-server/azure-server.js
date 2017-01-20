"use strict";
var tslib_1 = require("tslib");
function serve(main) {
    return function (context, request) {
        var req = tslib_1.__assign({}, request);
        req.pathName = req.pathName || context.bindingData.pathName || '';
        req.pathParts = req.pathName.split('/').filter(function (x) { return x.length > 0; });
        if (req.query.ping != null) {
            context.done(null, {
                status: 200,
                headers: { 'Content-Type': 'text/plain' },
                body: 'PONG',
            });
            return;
        }
        main(context, req)
            .then(function () { })
            .catch(function (err) { return console.error(err); });
    };
}
exports.serve = serve;
//# sourceMappingURL=azure-server.js.map