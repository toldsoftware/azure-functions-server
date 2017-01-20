import * as T from '../src/types';

declare let require: any;
const http = require('http');
const https = require('https');

// schedule: 0 0 0 * * *
export async function tick(context: T.TimerContext, timer: T.Timer) {

    let urls = [
        'https://told-azure-functions-server-test.azurewebsites.net/api/example-function?ping=true',
        'https://told-azure-functions-server-test.azurewebsites.net/api/example-function-get-blob?ping=true',
        'https://told-azure-functions-server-test.azurewebsites.net/api/example-function-resource?ping=true',
    ];

    let doneCount = 0;

    let callDone = (url: string) => {
        doneCount++;
        context.log('Keep Alive END: ', url);

        if (doneCount >= urls.length) {
            context.done();
        }
    };

    for (let x of urls) {
        context.log('Keep Alive START: ', x);
        let http_s = http;
        if (x.match(/^https/)) {
            http_s = https;
        }

        http_s.get(x, (res: any) => {
            console.log('statusCode:', res.statusCode);
            callDone(x);
        });
    }

    let timeStamp = new Date().toISOString();

    if (timer.isPastDue) {
        context.log('Timer is Past Due');
    }
    context.log('Timer started!', timeStamp);
}