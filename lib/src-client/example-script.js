"use strict";
var tslib_1 = require("tslib");
var src_1 = require("@told/platform/lib/src");
var http = src_1.Platform.http();
function setup() {
    var _this = this;
    (function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var r;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, http.request('./data/data.json')];
                case 1:
                    r = _a.sent();
                    if (r.data.value === true) {
                        document.body.appendChild(document.createTextNode('Json Request SUCCESS'));
                    }
                    else {
                        document.body.appendChild(document.createTextNode('Json Request FAILED'));
                    }
                    return [4 /*yield*/, http.request('./data/data.json.txt')];
                case 2:
                    r = _a.sent();
                    if (r.data.value === true) {
                        document.body.appendChild(document.createTextNode('Json Request SUCCESS'));
                    }
                    else {
                        document.body.appendChild(document.createTextNode('Json Request FAILED'));
                    }
                    return [4 /*yield*/, http.request('./data/example-data.json')];
                case 3:
                    r = _a.sent();
                    if (r.data.value === true) {
                        document.body.appendChild(document.createTextNode('Json Request SUCCESS'));
                    }
                    else {
                        document.body.appendChild(document.createTextNode('Json Request FAILED'));
                    }
                    return [2 /*return*/];
            }
        });
    }); })().then();
}
setup();
//# sourceMappingURL=example-script.js.map