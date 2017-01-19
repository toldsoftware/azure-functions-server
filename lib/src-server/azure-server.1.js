"use strict";
function serve(main) {
    return function (context, request) {
        main(context, request)
            .then(function () { })
            .catch(function (err) { return console.error(err); });
    };
}
exports.serve = serve;
//# sourceMappingURL=azure-server.1.js.map