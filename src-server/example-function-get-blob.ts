import { createBlobService, BlobUtilities } from 'azure-storage';
import { v1 as guid } from 'node-uuid';

import * as T from './../src/index';

export interface GetBlobRequest extends T.Request<{ setup?: boolean, suffixes?: string }, {}> {
}

export interface GetBlobResponseData {
    urls: {
        blobUrl: string;
        blobSasUrl: string;
        suffix: string;
    }[];
}

export interface GetBlobResponseBody extends T.ResponseBody<GetBlobResponseData> { }

export async function main(context: T.Context<GetBlobResponseData>, request: GetBlobRequest) {
    context.log('START',
        'request.query', request.query
    );

    let containerName = 'user-storage';
    let blobBaseName = '' + guid();

    let cookie = request.headers['Cookie'] || request.headers['cookie'];

    context.log('cookie=', cookie);

    if (cookie != null) {
        let m = cookie.match(/blobBaseName=([^;]+)(?:;|$)/);
        if (m) {
            blobBaseName = m[1];
        }
    }

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

    let suffixes = (request.query.suffixes || '').split(',').map(x => x.trim()).filter(x => x.length > 0);
    if (suffixes.length === 0) {
        suffixes = [''];
    }

    let urls: { blobUrl: string, blobSasUrl: string, suffix: string }[] = [];

    for (let suffix of suffixes) {
        let blobSas = service.generateSharedAccessSignature(containerName, blobBaseName + '-' + suffix, sharedAccessPolicy);
        let blobUrl = service.getUrl(containerName, blobBaseName + '-' + suffix);
        let blobSasUrl = service.getUrl(containerName, blobBaseName + '-' + suffix, blobSas);

        urls.push({ blobUrl, blobSasUrl, suffix });
    }

    context.done(null, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/javascript',
            'Set-Cookie': `blobBaseName=${blobBaseName}; Expires=${new Date(Date.now() + 356 * 24 * 60 * 60 * 1000).toUTCString()}; Secure; HttpOnly`
        },
        body: {
            ok: true,
            data: { urls },
        }
    });

    context.log('END blobBaseName=', blobBaseName);
}