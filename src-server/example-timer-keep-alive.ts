import * as T from '../src/types';

declare let require: any;
const http = require('http');
const https = require('https');

// schedule: 0 0 0 * * *
export async function tick(context: T.TimerContext, timer: T.Timer) {

    let urls = [
        'https://azure-blob-access-test.azurewebsites.net/api/get-blob',
        'https://told-azure-functions-server-test.azurewebsites.net/api/example-function-get-blob',
    ];

    let urlParts = urls.map(x => {
        let m = x.match(/(https?):\/\/(.*)\/(.*)/);
        return {
            https: m[1] === 'https',
            host: m[2],
            path: m[3]
        };
    });

    for (let x of urlParts) {
        if (x.https) {
            https(x);
        } else {
            http(x);
        }
    }

    let timeStamp = new Date().toISOString();

    if (timer.isPastDue) {
        console.log('Timer is Past Due');
    }
    context.log('Timer ran!', timeStamp);
    context.done();
}