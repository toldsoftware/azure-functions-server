"use strict";
var lib_1 = require("@told/platform/lib");
var host = 'http://told-azure-functions-server-test.azurewebsites.net/api/example-function';
var timeout = 10000;
describe('getBlob', function () {
    lib_1.setupBrowser();
    var http = lib_1.Platform.http();
    it('should return expected text', function (done) {
        http.request(host).then(function (r) {
            var responseObj = JSON.parse(r.data);
            // console.log(responseObj);
            expect(responseObj.data.text).toMatch(/Example Output/);
            done();
        }).catch(fail);
    }, timeout);
});
//# sourceMappingURL=example-function.spec.js.map