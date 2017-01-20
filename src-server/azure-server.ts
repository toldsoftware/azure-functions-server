import * as T from './../src';

export function serve<TData, TQuery, TBody>(main: T.MainEntryPoint<TData, TQuery, TBody>): T.MainEntryPoint_Sync<TData, TQuery, TBody> {
    return (context: T.Context<TData>, request: T.Request<TQuery, TBody>) => {

        let req = { ...request };
        req.pathName = req.pathName || '';
        req.pathParts = req.pathName.split('/').filter(x => x.length > 0);

        if ((req.query as any).ping != null) {
            context.done(null, { body: 'PING' as any, status: 200, headers: null });
            return;
        }

        main(context, req)
            .then(() => { })
            .catch(err => console.error(err));
    };

}

