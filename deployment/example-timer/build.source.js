// Intentionally global
___export = require('./../../lib/src-server/azure-timer').run(require('./../../lib/src-server/example-timer').tick);
module.exports = ___export;