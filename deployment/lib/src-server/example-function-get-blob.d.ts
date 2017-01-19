import { Context, Request, ResponseBody } from './../src';
export interface GetBlobRequest extends Request<{
    setup?: boolean;
    suffixesCsv?: string;
}, {}> {
}
export interface GetBlobResponseData {
    urls: {
        blobUrl: string;
        blobSasUrl: string;
    }[];
}
export interface GetBlobResponseBody extends ResponseBody<GetBlobResponseData> {
}
export declare function main(context: Context<GetBlobResponseData>, request: GetBlobRequest): Promise<void>;
