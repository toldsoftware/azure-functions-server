import * as T from "../src/types";

import { ExampleFunctionRequest, ExampleFunctionResponseData } from "../src/example-function-model";

export function main(context: T.Context<ExampleFunctionResponseData>, request: ExampleFunctionRequest) {

    if (request.query.setup) {
        console.log("Setup was triggered");
    }

    context.done(null, {
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/javascript",
            "X-Told-Test-Header": "test-header",
        },
        body: {
            ok: true,
            data: { text: "Example Output" },
        }
    });
}