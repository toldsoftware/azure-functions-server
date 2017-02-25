"use strict";
var _logger = function (message) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    console.log.apply(console, [message].concat(args));
};
function setLogger(logger) {
    _logger = logger;
}
exports.setLogger = setLogger;
function log(message) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    _logger && _logger.apply(void 0, [message].concat(args));
}
exports.log = log;
//# sourceMappingURL=logger.js.map