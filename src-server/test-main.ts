import * as http from 'http';
import * as url from 'url';
import * as querystring from 'querystring';

import * as T from './../src';
import { main as resourceMain } from './example-function-resource';

export function serve<T, TQuery, TBody>(functions: { name: string, main: T.MainEntryPoint<any, any, any> }[], port = 8765) {
    console.log('Server Started at http://localhost:' + port);

    http.createServer((req: any, res: any) => {

        console.log('__dirname=', __dirname);

        let uri = url.parse(req.url);
        let query = querystring.parse(uri.query);

        let content = '';

        req.on('data', (chunk: any) => content += chunk);
        req.on('end', () => {
            let body = JSON.parse(content.length > 0 ? content : '{}');

            console.log('START Request:',
                'query', query,
                'body', body,
            );

            let context: T.Context<T> = {
                log: (m, ...x) => console.log(m, ...x),
                done: (err, r) => {
                    if (err) {
                        console.error(err);
                        res.writeHead(500, { 'Content-Type': 'text/plain' });
                        res.end('ERROR: ' + err);
                        return;
                    }

                    if (typeof r.body === 'object' && !(r.body instanceof Buffer)) {
                        r.body = JSON.stringify(r.body) as any;
                    }

                    res.writeHead(r.status || 200, r.headers || { 'Content-Type': 'text/plain' });
                    res.end(r.body);
                    console.log('END Request:', r.body);
                }
            };

            // Process Request
            let request = { query, body: JSON.parse(req.body || '{}'), pathName: uri.pathname || '', pathParts: (uri.pathname as string).split('/').filter(p => p.length > 0), headers: {} };
            if (request.pathParts.length === 0) {
                request.query.name = '../deployment/resources/test-main.html';
                resourceMain(context, request).then();
            } else if (request.pathParts[0] === 'resources' || request.pathParts[0] === 'example-function-resource') {
                request.pathName = request.pathName
                    .replace('/resources/', '../deployment/resources/')
                    .replace('resources/', '../deployment/resources/')
                    .replace('/example-function-resource/', '../deployment/resources/')
                    .replace('example-function-resource/', '../deployment/resources/')
                    ;

                request.pathParts.splice(0, 1);
                resourceMain(context, request).then();
            } else if (functions.filter(x => x.name === request.pathParts[0]).length > 0) {
                let f = functions.filter(x => x.name === request.pathParts[0])[0];
                request.pathName = request.pathName.replace(`/${f.name}/`, '/').replace(`${f.name}/`, '').replace(`${f.name}`, '');
                request.pathParts.splice(0, 1);
                try {
                    f.main(context, request)
                        .then(() => { })
                        .catch((err: any) => console.error(err));
                } catch (err) {
                    console.error(err);
                }
            } else {
                context.done('Unknown Request', null);
            }
        });

    }).listen(port);
}

