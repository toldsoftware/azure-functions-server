// Intentionally global
___export = require('./../lib/src-server/azure-server').serve(require('./../lib/src-server/example-resource').main);
module.exports = ___export;