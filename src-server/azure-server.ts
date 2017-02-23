import * as path from 'path';

import * as T from './../src';
import { dir } from './../src/root-dir';

import { _printCallTree } from '../src-cli/injectors/call-tree';
import { injectPromiseWrapper } from '../src-cli/injectors/promise-wrapper';
declare var ___callTree: any;
declare var ___call: any;
const DEBUG = typeof ___callTree !== 'undefined';
if (DEBUG) {
    injectPromiseWrapper();
}

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

        if (DEBUG) {
            const contextInner = context;
            context = {
                done() {
                    return ___call(contextInner.done, 'done', contextInner, arguments);
                },
                log() {
                    return ___call(contextInner.log, 'log', contextInner, arguments);
                }
            };
        }

        main(context, req)
            .then(() => {
                if (DEBUG) {
                    context.log(_printCallTree(___callTree));
                }
            })
            .catch(err => {
                context.log('Uncaught Error:', err);
                if (DEBUG) {
                    context.log(_printCallTree(___callTree));
                }
                context.done(err, null);
            });
    };

}

