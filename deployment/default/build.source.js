// Intentionally global
___export = require('./../../lib/src-server/azure-server').setDirName(__dirname).serve(require('./../../lib/src-server/default').main);
module.exports = ___export;