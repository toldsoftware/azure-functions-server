"use strict";
function run(main, port) {
    if (port === void 0) { port = 9876; }
    console.log('Timer Started at http://localhost:' + port);
    var context = {
        log: function (m) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            return console.log.apply(console, [m].concat(args));
        },
        done: function () {
            console.log('END Timer');
        }
    };
    main(context, { isPastDue: false })
        .then(function () { })
        .catch(function (err) { return console.error(err); });
    // // Wait for cancel
    // http.createServer(function (req: any, res: any) {
    // }).listen(port);
}
exports.run = run;
//# sourceMappingURL=test-timer.js.map