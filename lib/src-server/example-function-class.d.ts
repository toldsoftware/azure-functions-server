import * as T from '../src/types';
import { ExampleFunctionRequest, ExampleFunctionResponseData } from '../src/example-function-model';
export declare function main(context: T.Context<ExampleFunctionResponseData>, request: ExampleFunctionRequest): Promise<void>;
export declare class TestClass {
    protected c: number;
    protected val: number;
    constructor(a: number, b: number, c: number);
    testMethod(): string;
}
export declare class TestSubClass extends TestClass {
    constructor(a: number, b: number, c: number);
    testMethod2(): string;
}
