// Intentionally global
___export = require('@told/azure-functions-server/lib/src-server/azure-timer').run(require('./../lib/src-server/FUNCTION_NAME').tick);
module.exports = ___export;