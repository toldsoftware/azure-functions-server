"use strict";
function main(context, request) {
    if (request.query.setup) {
        console.log('Setup was triggered');
    }
    context.done(null, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/javascript',
            'X-Told-Test-Header': 'test-header',
        },
        body: {
            ok: true,
            data: { text: 'Example Output DEPLOYMENT FOLDER' },
        }
    });
}
exports.main = main;
//# sourceMappingURL=example-function.js.map