import * as T from '../src/types';

import { ExampleFunctionRequest, ExampleFunctionResponseData } from '../src/example-function-model';

export async function main(context: T.Context<ExampleFunctionResponseData>, request: ExampleFunctionRequest) {

    let obj = new TestClass(1, 2, 7);
    let val = obj.testMethod()

    context.done(null, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
            'X-Told-Test-Header': 'test-header',
        },
        body: {
            ok: true,
            data: { text: 'Value: ' + val },
        }
    });
}


export class TestClass {
    protected val = 0;
    constructor(a: number, b: number, protected c: number) {
        this.val = a + b;
    }

    testMethod() {
        return `a+b=${this.val}; this.c=${this.c}`;
    }
}


export class TestSubClass extends TestClass {
    constructor(a: number, b: number, c: number) {
        super(a, b, c);
    }

    testMethod2() {
        return `a+b=${this.val}; this.c=${this.c}`;
    }
}