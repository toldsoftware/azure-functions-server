// Intentionally global
___export = require('./../lib/src-server/azure-server').serve(require('./../lib/src-server/example-function-resource').main);
module.exports = ___export;