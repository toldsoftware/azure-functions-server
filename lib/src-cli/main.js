var ncp = require('ncp').ncp;
var fs = require('fs');
var replaceStream = require('replacestream');
var watch = require('node-watch');
var rimraf = require('rimraf');
function createDeployment() {
    console.log('Create Deployment');
    // Clean Directory
    if (fs.existsSync('deployment')) {
        rimraf.sync('deployment');
    }
    fs.mkdirSync('deployment');
    // Copy package.json
    ncp('./package.json', './deployment/package.json', function (err) {
        if (err) {
            console.error(err);
        }
        console.log('Copied "package.json" to "deployment"');
    });
    // Copy lib files
    ncp('./lib', './deployment/lib', function (err) {
        if (err) {
            console.error(err);
        }
        console.log('Copied "lib/" to "deployment/lib/"');
    });
    // Create Function Entries
    var serverDir = './src-server';
    fs.readdir(serverDir, function (err, files) {
        if (err) {
            console.error(err);
        }
        var tsFiles = files.filter(function (x) { return x.indexOf('.ts') >= 0; });
        var _loop_1 = function (f) {
            var path = serverDir + '/' + f;
            var stream = fs.readFile(path, 'utf8', function (err, data) {
                if (err) {
                    console.error(err);
                }
                if (data.match(/export\s+function\s+main\s*\(/)) {
                    console.log('src-server main file: ', f);
                    var functionName_1 = f.replace('.ts', '');
                    // Clone the function-BOILERPLATE folder
                    var functionBoilerplateDir = __dirname + '/function-BOILERPLATE';
                    ncp(functionBoilerplateDir, './deployment/' + functionName_1, {
                        transform: function (read, write) {
                            read
                                .pipe(replaceStream('FUNCTION_NAME', functionName_1))
                                .pipe(write);
                        }
                    }, function (err) {
                        if (err) {
                            console.error(err);
                        }
                        console.log('Created Function Boilerplate for ' + functionName_1);
                    });
                }
            });
        };
        for (var _i = 0, tsFiles_1 = tsFiles; _i < tsFiles_1.length; _i++) {
            var f = tsFiles_1[_i];
            _loop_1(f);
        }
    });
}
createDeployment();
// if( -w)
watch(['./lib', './src-server', './package.json'], function () {
    createDeployment();
});
//# sourceMappingURL=main.js.map