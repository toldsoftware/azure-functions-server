import * as T from './../src';

declare var require: any;
let http = require('http');
let url = require('url');
let queryString = require('querystring');
// let jsonparse = require("jsonparse");

export function serve<T, TQuery, TBody>(main: T.MainEntryPoint<T, TQuery, TBody>, port = 9876) {
    console.log('Server Started at http://localhost:' + port);

    http.createServer(function (req: any, res: any) {

        let uri = url.parse(req.url);
        let query = queryString.parse(uri.query);

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
                done: (u, r) => {
                    res.writeHead(r.status || 200, r.headers || { 'Content-Type': 'text/plain' });
                    res.end(JSON.stringify(r.body));

                    console.log('END Request:', r.body);
                }
            };

            main(context, { query, body: JSON.parse(req.body || '{}'), pathName: uri.pathName || '', pathParts: (uri.pathName as string).split('/').filter(p => p.length > 0) })
                .then(() => { })
                .catch(err => console.error(err));
        });

    }).listen(port);
}

