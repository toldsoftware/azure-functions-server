import { injectFunctionWrapper } from './injectors/function-wrapper-webpack-injection';

export function injectWebpack(text: string) {
    text = injectFunctionWrapper(text);
    return text;
}