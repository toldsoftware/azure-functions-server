import { setupBrowser, Platform } from '@told/platform/lib';
import { ExampleFunctionRequest, ExampleFunctionResponseBody } from './example-function-model';

let host = 'http://told-azure-functions-server-test.azurewebsites.net/api/example-function';
let timeout = 10000;

describe('getBlob', () => {

    setupBrowser();
    let http = Platform.http();

    it('should return expected text', (done) => {
        http.request(host).then((r: any) => {
            let responseObj = JSON.parse(r.data) as ExampleFunctionResponseBody;
            // console.log(responseObj);
            expect(responseObj.data.text).toMatch(/Example Output/);
            done();
        }).catch(fail);
    }, timeout);

});