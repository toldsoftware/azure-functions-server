export interface Request<TQuery, TBody> {
    query: TQuery;
    body: TBody;
}

export interface Response<T> {
    status?: number;
    headers?: {
        // Note: CORS Must be set in Azure Functions Manually
        "Access-Control-Allow-Origin"?: string,
        "Content-Type"?: string,
        [key: string]: string,
    };
    body: ResponseBody<T>;
}

export interface ResponseBody<T> {
    ok: boolean;
    data?: T;
    errors?: string[];
}

export interface Context<T> {
    log(...text: any[]): void;
    done(u?: any, response?: Response<T>): void;
}

export type MainEntryPoint<T, TQuery, TBody> = (context: Context<T>, request: Request<TQuery, TBody>) => void;
