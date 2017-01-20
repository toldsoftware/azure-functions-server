import * as T from './../src';

declare let require: any;
declare let __dirname: string;
const fs = require('fs');
const p = require('path') as { resolve(...parts: string[]): string };

export async function main(context: T.RawContext, request: T.Request<{ name: string }, any>) {

    // BUG: File extensions are not supported
    // Workaround is to add an / at the end, so need to remove that here
    let filePath = request.query.name || request.pathName.replace(/\/$/, '');
    let path = p.resolve(__dirname, '..', 'resources', filePath);

    context.log('filePath=' + filePath + ' path=' + path + ' request.query.name=' + request.query.name + ' request.pathName=' + request.pathName);

    fs.readFile(path, (err: any, data: any) => {
        context.log('path=' + path + ' err=' + err);

        if (err != null) {
            context.done(err, {
                status: 404,
                headers: {
                    'Content-Type': 'plain/text',
                },
                body: ('File not Found: ' + filePath) as any
            });
            return;
        }

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