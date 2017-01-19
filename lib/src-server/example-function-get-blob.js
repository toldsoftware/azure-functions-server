"use strict";
var tslib_1 = require("tslib");
var azure_storage_1 = require("azure-storage");
;
var guid = require('node-uuid').v1;
function main(context, request) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var containerName, blobBaseName, service, expiryDate, sharedAccessPolicy, suffixes, urls, _i, suffixes_1, suffix, blobSas, blobUrl, blobSasUrl;
        return tslib_1.__generator(this, function (_a) {
            context.log('START', 'request.query', request.query);
            containerName = 'user-storage';
            blobBaseName = '' + guid();
            service = azure_storage_1.createBlobService();
            // One-time setup
            if (request.query.setup) {
                // Ensure container exists
                service.createContainerIfNotExists(containerName, { publicAccessLevel: 'blob' }, function (error, result, response) {
                    if (!error) {
                    }
                });
            }
            expiryDate = new Date();
            expiryDate.setFullYear(expiryDate.getFullYear() + 1);
            sharedAccessPolicy = {
                AccessPolicy: {
                    Permissions: azure_storage_1.BlobUtilities.SharedAccessPermissions.READ
                        + azure_storage_1.BlobUtilities.SharedAccessPermissions.WRITE
                        + 'c',
                    // + BlobUtilities.SharedAccessPermissions.CREATE,
                    Expiry: expiryDate
                },
            };
            suffixes = (request.query.suffixesCsv || '').split(',').map(function (x) { return x.trim(); }).filter(function (x) { return x.length > 0; });
            if (suffixes.length === 0) {
                suffixes = [''];
            }
            urls = [];
            for (_i = 0, suffixes_1 = suffixes; _i < suffixes_1.length; _i++) {
                suffix = suffixes_1[_i];
                blobSas = service.generateSharedAccessSignature(containerName, blobBaseName, sharedAccessPolicy);
                blobUrl = service.getUrl(containerName, blobBaseName);
                blobSasUrl = service.getUrl(containerName, blobBaseName, blobSas);
                urls.push({ blobUrl: blobUrl, blobSasUrl: blobSasUrl });
            }
            context.done(null, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/javascript',
                    'X-Told-Test-Header': 'test-header',
                },
                body: {
                    ok: true,
                    data: { urls: urls },
                }
            });
            context.log('END blobBaseName=', blobBaseName);
            return [2 /*return*/];
        });
    });
}
exports.main = main;
//# sourceMappingURL=example-function-get-blob.js.map