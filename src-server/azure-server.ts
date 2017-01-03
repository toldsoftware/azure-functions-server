import * as T from './../src';

export function serve<TData, TQuery, TBody>(main: T.MainEntryPoint<TData, TQuery, TBody>): T.MainEntryPoint_Sync<TData, TQuery, TBody> {
    return (context: T.Context<TData>, request: T.Request<TQuery, TBody>) => {
        main(context, request)
            .then(() => { })
            .catch(err => console.error(err));
    };

}

