import * as T from './types';

export interface ExampleFunctionRequest extends T.Request<{ setup?: boolean }, {}> {
}

export interface ExampleFunctionResponseData {
    text: string;
}

export interface ExampleFunctionResponseBody extends T.ResponseBody<ExampleFunctionResponseData> { }
