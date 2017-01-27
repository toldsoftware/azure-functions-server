declare var require: any;
const webpack = require('webpack');

export function runWebpackAzureFunction(functionDirsOrFiles: string[]) {
    return new Promise((resolve, reject) => {
        let entries: { [name: string]: string } = {};
        functionDirsOrFiles.filter(x => x.length > 0).forEach(x => {
            if (x.indexOf('.source.js') >= 0) {
                entries[x.replace('.source.js', '.js')] = x;
            } else {
                entries[x + '/build.js'] = x + '/build.source.js';
            }
        });

        console.log('Webpack Azure Functions START');
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
            devtool: 'source-map',
            target: 'node',
            node: {
                __filename: false,
                __dirname: false,
            }
        }, (err: any, stats: any) => {
            if (err) { console.error(err); reject(); return; }
            console.log('Webpack Azure Functions END');
            // console.log(stats);

            resolve();
        });
    });
}

export function runWebpackClient(entrySourceFiles: string[]) {
    return new Promise((resolve, reject) => {
        let entries: { [name: string]: string } = {};
        entrySourceFiles.filter(x => x.length > 0).forEach(x => entries[x.replace('.source.js', '.js')] = x);

        console.log('Webpack Client START');
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
            devtool: '#source-map',
            module: {
                rules: [
                    {
                        test: /\.js$/,
                        use: ['source-map-loader'],
                        enforce: 'pre'
                    }
                ]
            }
            // resolve: {
            //     extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js']
            // },
            // module: {
            //     rules: [{
            //         test: /\.tsx?$/,
            //         loader: 'ts-loader'
            //     }]
            // },
            plugins: [
                //     new BrowserSyncPlugin({
                //     host: 'localhost',
                //     port: 3000,
                //     server: {
                //         baseDir: ['./resources']
                //     }
                // })
                // , 
                // // Uglify
                // new webpack.optimize.UglifyJsPlugin({
                //     sourceMap: true,
                //     mangle: false,
                //     test: /\.(js|jsx)$/
                // })
            ]
        }, (err: any, stats: any) => {
            if (err) { console.error(err); reject(); return; }
            console.log('Webpack Client END');
            // console.log(stats);
            resolve();
        });
    });
}
