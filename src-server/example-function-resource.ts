import * as fs from 'fs';
import * as Path from 'path';

import * as T from './../src';

export async function main(context: T.RawContext, request: T.Request<{ name: string }, any>) {

    // BUG: File extensions are not supported
    // Workaround is to add an /file at the end, so need to remove that here
    let filePath = request.query.name || request.pathName.replace(/\/$/, '').replace(/\/(file)$/, '');
    let path = Path.resolve(__dirname, '..', 'resources', filePath);

    context.log('filePath=' + filePath + ' path=' + path + ' __dirname=' + __dirname + ' request.query.name=' + request.query.name + ' request.pathName=' + request.pathName);

    fs.readFile(path, (err: any, data: any) => {
        context.log('path=' + path);

        if (err != null) {
            context.log('ERROR: ' + err);
            context.done(null, {
                status: 404,
                headers: {
                    'Content-Type': 'text/plain',
                },
                body: ('File Not Found: ' + filePath) as any
            });
            return;
        }

        let body = data;

        let type = 'text/plain';

        if (path.match('\.html$')) { type = 'text/html'; }
        if (path.match('\.css$')) { type = 'text/css'; }
        if (path.match('\.js$')) { type = 'application/x-javascript'; }
        if (path.match('\.json$')) { type = 'application/json'; }
        if (path.match('\.jpg$')) { type = 'image/jpeg'; }
        if (path.match('\.png$')) { type = 'image/png'; }
        if (path.match('\.gif$')) { type = 'image/gif'; }
        if (path.match('\.ico$')) { type = 'image/x-icon'; }

        context.done(null, {
            headers: {
                'Content-Type': type,
            },
            body: body as any
        });
    });


}