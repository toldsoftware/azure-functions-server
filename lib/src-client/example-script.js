"use strict";
var tslib_1 = require("tslib");
var src_1 = require("@told/platform/lib/src");
var http = src_1.Platform.http();
function GetJsonData(url) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var r, err_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, http.request(url)];
                case 1:
                    r = _a.sent();
                    if (r.data.value === true) {
                        document.body.appendChild(document.createTextNode('\n<br>Json Request SUCCESS url=' + url));
                    }
                    else {
                        document.body.appendChild(document.createTextNode('\n<br>Json Request FAILED url=' + url));
                    }
                    return [3 /*break*/, 3];
                case 2:
                    err_1 = _a.sent();
                    document.body.appendChild(document.createTextNode('\n<br>Json Request ERROR url=' + url + ' err=' + err_1));
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function setup() {
    var _this = this;
    (function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, GetJsonData('./data/data.json')];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, GetJsonData('./data/data.json.txt')];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, GetJsonData('./data/example-data.json')];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, GetJsonData('./data2/data.json')];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, GetJsonData('./data2/data.json.txt')];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, GetJsonData('./data2/example-data.json')];
                case 6:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); })().then();
}
setup();
//# sourceMappingURL=example-script.js.map