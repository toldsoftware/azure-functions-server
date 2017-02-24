import * as T from '../src/types';

import { ExampleFunctionRequest, ExampleFunctionResponseData } from '../src/example-function-model';

export async function main(context: T.Context<ExampleFunctionResponseData>, request: ExampleFunctionRequest) {

    if (request.query.setup) {
        console.log('Setup was triggered');
    }

    const start = '42';

    const a = await testManualPromise(start);
    const b = await testAsync(a);

    let promises = [testAsync(a), testAsync(a), testAsync(a)];
    await Promise.all(promises);

    context.done(null, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
            'X-Told-Test-Header': 'test-header',
        },
        body: {
            ok: true,
            data: { text: 'Example Output' },
        }
    });
}

function testManualPromise(input: string) {
    console.log('testManualPromise START');

    return new Promise<string>((resolve, reject) => {
        setTimeout(() => {
            console.log('testManualPromise END');
            resolve(input + 'value_testManualPromise');
        }, 10);
    });
}

async function testAsync(input: string) {
    console.log('testAsync START');
    await delay();
    console.log('testAsync END');

    return input + 'value_testAsync';
}

function delay(time = 10) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, time);
    });
}