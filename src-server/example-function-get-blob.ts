import { createBlobService, BlobUtilities } from 'azure-storage';
import { Context, Request, Response, ResponseBody, MainEntryPoint } from './../src';

export interface GetBlobRequest extends Request<{ setup?: boolean, suffixesCsv?: string }, {}> {
}

export interface GetBlobResponseData {
    urls: {
        blobUrl: string;
        blobSasUrl: string;
    }[];
}

export interface GetBlobResponseBody extends ResponseBody<GetBlobResponseData> { }

declare var require: any;
interface Guid extends String { };
let guid = require('node-uuid').v1 as () => Guid;

export async function main(context: Context<GetBlobResponseData>, request: GetBlobRequest) {
    context.log('START',
        'request.query', request.query
    );

    let containerName = 'user-storage';
    let blobBaseName = '' + guid();

    // Uses env.AZURE_STORAGE_CONNECTION_STRING
    let service = createBlobService();

    // One-time setup
    if (request.query.setup) {

        // Ensure container exists
        service.createContainerIfNotExists(containerName, { publicAccessLevel: 'blob' }, (error, result, response) => {
            if (!error) {
            }
        });
    }

    let expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);

    let sharedAccessPolicy = {
        AccessPolicy: {
            Permissions:
            BlobUtilities.SharedAccessPermissions.READ
            + BlobUtilities.SharedAccessPermissions.WRITE
            // CREATE Missing (Is it needed?)
            + 'c',
            // + BlobUtilities.SharedAccessPermissions.CREATE,
            Expiry: expiryDate
        },
    };

    let suffixes = (request.query.suffixesCsv || '').split(',').map(x => x.trim()).filter(x => x.length > 0);
    if (suffixes.length === 0) {
        suffixes = [''];
    }

    let urls: { blobUrl: string, blobSasUrl: string }[] = [];

    for (let suffix of suffixes) {
        let blobSas = service.generateSharedAccessSignature(containerName, blobBaseName, sharedAccessPolicy);
        let blobUrl = service.getUrl(containerName, blobBaseName);
        let blobSasUrl = service.getUrl(containerName, blobBaseName, blobSas);

        urls.push({ blobUrl, blobSasUrl });
    }

    context.done(null, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/javascript',
            'X-Told-Test-Header': 'test-header',
        },
        body: {
            ok: true,
            data: { urls },
        }
    });

    context.log('END blobBaseName=', blobBaseName);
}