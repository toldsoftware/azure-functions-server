import * as fs from 'fs';
import * as Path from 'path';

import * as T from './../src';
import { resolveAllUrls, getPathDepthPrefix } from './../src/resolve-url';
import { dir } from './../src/root-dir';

import * as replaceStream from 'replacestream';

export async function main(context: T.RawContext, request: T.Request<{ name: string }, any>, pathDepthFromApiRoot = 1) {

    // BUG: File extensions are not supported with Azure Fuctions Routing
    // Workaround is to add an /file at the end, so need to remove that here
    // Handle Browser Requested Files
    let pathOrig = request.query.name || request.pathName;

    let filePath = pathOrig
        .replace(/\/$/, '')
        .replace(/\/(file)$/, '')
        // For local debugging of deployment
        .replace(/\/([^\/]+\.js\.map)$/, '.map')
        ;

    let path = Path.resolve(dir.rootDir, getPathDepthPrefix(pathDepthFromApiRoot - 1), 'resources', filePath.replace(/^\//, ''));

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

        let type = 'text/plain';

        if (path.match('\.html$')) { type = 'text/html'; }
        if (path.match('\.css$')) { type = 'text/css'; }
        if (path.match('\.js$')) { type = 'application/x-javascript'; }
        if (path.match('\.json$')) { type = 'application/json'; }
        if (path.match('\.jpg$')) { type = 'image/jpeg'; }
        if (path.match('\.png$')) { type = 'image/png'; }
        if (path.match('\.gif$')) { type = 'image/gif'; }
        if (path.match('\.ico$')) { type = 'image/x-icon'; }

        // Auto Resolve Resource Urls?
        let body = data;

        if (type === 'text/html') {
            body = data.toString();
            body = resolveAllUrls(body, pathDepthFromApiRoot);
        }

        // // Prevent Json Curroption
        // if (type === 'application/json') {
        //     body = data.toString();
        //     body = JSON.parse(body);
        // }

        context.done(null, {
            headers: {
                'Content-Type': type,
            },
            body: body as any,
            // Bypass response handling
            isRaw: true
        });
    });


}