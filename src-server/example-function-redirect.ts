import * as T from '../src/types';

import { ExampleFunctionRequest, ExampleFunctionResponseData } from '../src/example-function-model';

export async function main(context: T.Context<ExampleFunctionResponseData>, request: ExampleFunctionRequest) {

    const redirectUrl = 'example-function';

    context.done(null, {
        status: 303,
        headers: {
            'Location': redirectUrl,
            'Content-Type': 'text/html',
        },
        body: `<html><head></head><body>Redirect</body></html>` as any,
    });
}