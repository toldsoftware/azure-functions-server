import * as T from './../src';
import * as R from './resource';

export async function main(context: T.RawContext, request: T.Request<{ name: string }, any>) {
    // Serve index.html as the default file

    request.query.name = 'index.html';
    return await R.main(context, request, 0);
}