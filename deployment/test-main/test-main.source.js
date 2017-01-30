var functions = [
    {name: 'default', main: require('./../../lib/src-server/default').main },
	{name: 'example-function', main: require('./../../lib/src-server/example-function').main },
	{name: 'example-function-get-blob', main: require('./../../lib/src-server/example-function-get-blob').main },
	{name: 'example-timer', main: require('./../../lib/src-server/example-timer').main },
	{name: 'example-timer-keep-alive', main: require('./../../lib/src-server/example-timer-keep-alive').main },
	{name: 'resource', main: require('./../../lib/src-server/resource').main }
];

module.exports = require('./../../lib/src-server/test-main').setDirName(__dirname).serve(functions);