import * as T from '../src/types';
import { ExampleFunctionRequest, ExampleFunctionResponseData } from '../src/example-function-model';
export declare function main(context: T.Context<ExampleFunctionResponseData>, request: ExampleFunctionRequest): Promise<void>;
export declare class TestClass {
    private c;
    private val;
    constructor(a: number, b: number, c: number);
    testMethod(): number;
}
