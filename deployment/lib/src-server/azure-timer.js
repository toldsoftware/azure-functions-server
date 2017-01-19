"use strict";
function run(tick) {
    return function (context, timer) {
        tick(context, timer)
            .then(function () { })
            .catch(function (err) { return console.error(err); });
    };
}
exports.run = run;
//# sourceMappingURL=azure-timer.js.map