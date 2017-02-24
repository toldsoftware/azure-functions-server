var functions = [
    {name: 'default', main: require('./../../lib/src-server/default').main },
	{name: 'example-function', main: require('./../../lib/src-server/example-function').main },
	{name: 'example-function-async-await', main: require('./../../lib/src-server/example-function-async-await').main },
	{name: 'example-function-class', main: require('./../../lib/src-server/example-function-class').main },
	{name: 'example-function-error-after-async', main: require('./../../lib/src-server/example-function-error-after-async').main },
	{name: 'example-function-error-before-async', main: require('./../../lib/src-server/example-function-error-before-async').main },
	{name: 'example-function-error-infinite-async-loop', main: require('./../../lib/src-server/example-function-error-infinite-async-loop').main },
	{name: 'example-function-error-infinite-loop', main: require('./../../lib/src-server/example-function-error-infinite-loop').main },
	{name: 'example-function-error-stack-overflow', main: require('./../../lib/src-server/example-function-error-stack-overflow').main },
	{name: 'example-function-get-blob', main: require('./../../lib/src-server/example-function-get-blob').main },
	{name: 'example-function-redirect', main: require('./../../lib/src-server/example-function-redirect').main },
	{name: 'example-timer', main: require('./../../lib/src-server/example-timer').main },
	{name: 'example-timer-keep-alive', main: require('./../../lib/src-server/example-timer-keep-alive').main },
	{name: 'resource', main: require('./../../lib/src-server/resource').main }
];

module.exports = require('./../../lib/src-server/test-main').setDirName(__dirname).serve(functions);