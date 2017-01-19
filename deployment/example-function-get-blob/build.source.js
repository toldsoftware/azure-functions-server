// Intentionally global
___export = require('./../lib/src-server/azure-server').serve(require('./../lib/src-server/example-function-get-blob').main);
module.exports = ___export;