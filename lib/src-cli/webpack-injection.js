"use strict";
var function_wrapper_webpack_injection_1 = require("./injectors/function-wrapper-webpack-injection");
function injectWebpack(text, ownSourceCode) {
    // console.log('injectWebpack ',
    //     // text.substr(0, 80),
    //     ownSourceCode.substr(0, 255));
    text = function_wrapper_webpack_injection_1.injectFunctionWrapper(text, ownSourceCode);
    return text;
}
exports.injectWebpack = injectWebpack;
//# sourceMappingURL=webpack-injection.js.map