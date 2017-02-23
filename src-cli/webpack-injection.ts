import { injectFunctionWrapper } from './injectors/function-wrapper-webpack-injection';

export function injectWebpack(text: string, ownSourceCode: string) {

    // console.log('injectWebpack ',
    //     // text.substr(0, 80),
    //     ownSourceCode.substr(0, 255));

    text = injectFunctionWrapper(text, ownSourceCode);
    return text;
}