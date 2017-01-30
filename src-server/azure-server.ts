import * as path from 'path';

import * as T from './../src';
import { dir } from './../src/root-dir';

export function setDirName(dirName: string) {
    dir.rootDir = path.resolve(dirName, '..');
    return this;
}

export function serve<TData, TQuery, TBody>(main: T.MainEntryPoint<TData, TQuery, TBody>): T.MainEntryPoint_Sync<TData, TQuery, TBody> {
    return (context: T.Context<TData>, request: T.Request<TQuery, TBody>) => {

        let req = { ...request };
        req.pathName = req.pathName || (context as any).bindingData.pathName || '';
        req.pathParts = req.pathName.split('/').filter(x => x.length > 0);

        if ((req.query as any).ping != null) {
            context.done(null, {
                status: 200,
                headers: { 'Content-Type': 'text/plain' },
                body: 'PONG' as any,
            });
            return;
        }

        // Auto-Parse Json
        if (typeof req.body === 'string') {
            let orig = req.body;
            try {
                req.body = JSON.parse(req.body as any) as any;
            }
            catch (err) {
                req.body = orig;
            }
        }

        main(context, req)
            .then(() => { })
            .catch(err => {
                context.log('Uncaught Error:', err);
                context.done(err, null);
            });
    };

}

