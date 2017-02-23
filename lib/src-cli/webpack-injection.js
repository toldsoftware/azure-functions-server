"use strict";
var function_wrapper_webpack_injection_1 = require("./injectors/function-wrapper-webpack-injection");
function injectWebpack(text) {
    text = function_wrapper_webpack_injection_1.injectFunctionWrapper(text);
    return text;
}
exports.injectWebpack = injectWebpack;
//# sourceMappingURL=webpack-injection.js.map