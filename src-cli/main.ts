declare var require: any;
const ncp = require('ncp').ncp;
const fs = require('fs');
const replaceStream = require('replacestream');
const watch = require('node-watch');
const rimraf = require('rimraf');

function createDeployment() {
    console.log('Create Deployment');

    // Clean Directory
    if (fs.existsSync('deployment')) {
        rimraf.sync('deployment');
    }
    fs.mkdirSync('deployment');

    // Copy package.json
    ncp('./package.json', './deployment/package.json', (err: any) => {
        if (err) {
            console.error(err);
        }
        console.log('Copied "package.json" to "deployment"');
    });

    // Copy lib files
    ncp('./lib', './deployment/lib', (err: any) => {
        if (err) { console.error(err); }
        console.log('Copied "lib/" to "deployment/lib/"');
    });

    // Create Function Entries
    let serverDir = './src-server';
    fs.readdir(serverDir, (err: any, files: string[]) => {
        if (err) { console.error(err); }

        let tsFiles = files.filter(x => x.indexOf('.ts') >= 0);

        for (let f of tsFiles) {

            let path = serverDir + '/' + f;

            let stream = fs.readFile(path, 'utf8', (err: any, data: string) => {
                if (err) { console.error(err); }

                if (data.match(/export\s+function\s+main\s*\(/)) {
                    console.log('src-server main file: ', f);

                    let functionName = f.replace('.ts', '');

                    // Clone the function-BOILERPLATE folder
                    ncp('./src-cli/function-BOILERPLATE', './deployment/' + functionName, {
                        transform: (read: any, write: any) => {
                            read
                                .pipe(replaceStream('FUNCTION_NAME', functionName))
                                .pipe(write);
                        }
                    }, (err: any) => {
                        if (err) { console.error(err); }
                        console.log('Created Function Boilerplate for ' + functionName);
                    });

                }
            });
        }

    });
}

createDeployment();

// if( -w)
watch(['./lib', './src-server', './package.json'], () => {
    createDeployment();
});