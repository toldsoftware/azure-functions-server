import * as T from './../src';

declare let require: any;
declare let __dirname: string;
const fs = require('fs');
const p = require('path') as { resolve(...parts: string[]): string };

export async function main(context: T.RawContext, request: T.Request<{ name: string }, any>) {

    let path = p.resolve(__dirname, '..', 'resources', request.query.name || request.pathName);

    fs.readFile(path, (err: any, data: any) => {
        context.log('path=' + path + ' err=' + err);

        let body = data;

        let type = 'application/javascript';

        if (path.match('\.jpg$')) { type = 'image/jpg'; }
        if (path.match('\.png$')) { type = 'image/png'; }
        if (path.match('\.html$')) { type = 'text/html'; }

        context.done(null, {
            headers: {
                'Content-Type': type,
            },
            body: body as any
        });
    });


}