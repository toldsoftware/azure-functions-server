import * as T from './../src';
export interface GetBlobRequest extends T.Request<{
    setup?: boolean;
    suffixes?: string;
}, {}> {
}
export interface GetBlobResponseData {
    urls: {
        blobUrl: string;
        blobSasUrl: string;
        suffix: string;
    }[];
}
export interface GetBlobResponseBody extends T.ResponseBody<GetBlobResponseData> {
}
export declare function main(context: T.Context<GetBlobResponseData>, request: GetBlobRequest): Promise<void>;
