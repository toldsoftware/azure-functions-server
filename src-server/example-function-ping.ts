import * as T from '../src/types';

export async function main(context: T.Context<any>, request: T.Request<{}, {}>) {

    const response = {
        body: request.body,
        headers: request.headers,
        path: request.pathName,
        query: request.query
    };

    context.log('Request=', response);

    context.done(null, {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        },
        body: {
            ok: true,
            data: response
        },
    });
}