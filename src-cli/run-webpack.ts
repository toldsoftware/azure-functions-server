declare var require: any;
const webpack = require('webpack');

export function runWebpack(functionDirs: string[]) {
    let entries: { [name: string]: string } = {};
    functionDirs.filter(x => x.length > 0).forEach(x => entries[x + '/build.js'] = x + '/build.source.js');

    console.log('Webpack START');
    console.log('entries=', entries);

    webpack({
        // configuration
        entry: {
            // './index.webpack.js': './index.js',
            ...entries
        },
        output: {
            path: './',
            filename: '[name]'
        },
        target: 'node',
        node: {
            __filename: false,
            __dirname: false,
        },
    }, (err: any, stats: any) => {
        if (err) { console.error(err); return; }
        console.log('Webpack END');
        // console.log(stats);
    });
}