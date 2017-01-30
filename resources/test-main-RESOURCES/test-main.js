var functions = [
    FUNCTION_MODULES
];

module.exports = require('@told/azure-functions-server/lib/src-server/test-main').setDirName(__dirname).serve(functions);