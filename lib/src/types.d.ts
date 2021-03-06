export interface SimpleRequest {
    pathName: string;
    pathParts: string[];
    headers: {
        [name: string]: string;
    };
}
export interface QueryRequest<TQuery> extends SimpleRequest {
    query: TQuery;
}
export interface Request<TQuery, TRequestBody> extends QueryRequest<TQuery> {
    body: TRequestBody;
}
export interface Response<TResponseData> {
    status?: number;
    headers?: {
        'Access-Control-Allow-Origin'?: string;
        'Content-Type'?: string;
        [key: string]: string;
    };
    body: ResponseBody<TResponseData>;
}
export interface ResponseBodyBase {
    ok: boolean;
    data?: any;
    errors?: string[];
}
export interface ResponseBody<TResponseData> extends ResponseBodyBase {
    data?: TResponseData;
}
export interface Context<TResponseData> {
    log(...text: any[]): void;
    done(err?: any, response?: Response<TResponseData>): void;
}
export interface RawContext {
    log(...text: any[]): void;
    done(err?: any, response?: any): void;
}
export declare type MainEntryPoint<TResponseData, TQuery, TRequestBody> = (context: Context<TResponseData>, request: Request<TQuery, TRequestBody>) => Promise<{}>;
export declare type MainEntryPoint_Sync<TResponseData, TQuery, TRequestBody> = (context: Context<TResponseData>, request: Request<TQuery, TRequestBody>) => void;
export interface Timer {
    isPastDue: boolean;
}
export interface TimerContext {
    log(...text: any[]): void;
    done(): void;
}
export declare type MainEntryPoint_Timer = (context: TimerContext, timer: Timer) => Promise<{}>;
export declare type MainEntryPoint_Timer_Sync = (context: TimerContext, timer: Timer) => void;
