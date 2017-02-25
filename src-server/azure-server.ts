import * as path from 'path';

import * as T from './../src';
import { dir } from './../src/root-dir';

import { _printCallTree, CallTreeNode, AfterFunctionCallback, BeforeFunctionCallback, Call } from '../src-cli/injectors/call-tree';
import { _injectPromiseWrapper } from '../src-cli/injectors/promise-wrapper';
declare var ___callTree: CallTreeNode;
declare var ___call: Call;
// declare var ___beforeFunctionCallback: BeforeFunctionCallback;
// declare var ___afterFunctionCallback: AfterFunctionCallback;
const DEBUG = typeof ___callTree !== 'undefined';
let _callTreeRoot: CallTreeNode = null;
if (DEBUG) {
    _injectPromiseWrapper();
    _callTreeRoot = ___callTree;
}

export function setDirName(dirName: string) {
    dir.rootDir = path.resolve(dirName, '..');
    return this;
}

export function serve<TData, TQuery, TBody>(main: T.MainEntryPoint<TData, TQuery, TBody>): T.MainEntryPoint_Sync<TData, TQuery, TBody> {
    let _callTree_runnerRoot: CallTreeNode = null;

    let runner = (context: T.Context<TData>, request: T.Request<TQuery, TBody>) => {
        T.setLogger((message, ...args) => context.log(message, ...args));

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
                    // Don't wrap log
                    return contextInner.log.apply(contextInner, arguments);
                }
            };
        }

        let debugIntervalId: any = null;
        let start = Date.now();

        try {
            if (DEBUG) {
                debugIntervalId = setInterval(() => {
                    context.log(`LONG PROCESS: ${Date.now() - start}ms`);
                    if (DEBUG) {
                        context.log(_printCallTree(_callTree_runnerRoot));
                    }
                }, 10 * 1000);
            }

            // Run
            main(context, req)
                .then(() => {
                    if (DEBUG) {
                        clearTimeout(debugIntervalId);
                        context.log(_printCallTree(_callTree_runnerRoot));
                    }
                })
                .catch(err => {
                    context.log('UNCAUGHT ERROR (Promise):', err);
                    if (DEBUG) {
                        clearTimeout(debugIntervalId);
                        context.log(_printCallTree(_callTree_runnerRoot));
                    }
                    context.done(err, null);
                });

        } catch (err) {
            context.log('UNCAUGHT ERROR:', err);
            if (DEBUG) {
                clearTimeout(debugIntervalId);
                context.log(_printCallTree(_callTree_runnerRoot));
            }
            context.done(err, null);
        }
    };

    if (DEBUG) {
        const innerIsolate = function () {
            _callTree_runnerRoot = ___callTree;
            return ___call(runner, 'serve', this, arguments);
        };

        return function () {
            ___callTree = _callTreeRoot;
            return ___call(innerIsolate, 'request', this, arguments);
        };
    } else {
        return runner;
    }
}

