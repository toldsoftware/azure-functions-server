import * as T from './../src';
export declare function serve<T, TQuery, TBody>(functions: {
    name: string;
    main: T.MainEntryPoint<any, any, any>;
}[], port?: number): void;
