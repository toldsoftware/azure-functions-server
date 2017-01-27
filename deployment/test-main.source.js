var functions = [
    {name: 'default', main: require('./../lib/src-server/default').main },
	{name: 'example-function-get-blob', main: require('./../lib/src-server/example-function-get-blob').main },
	{name: 'example-function-resource', main: require('./../lib/src-server/example-function-resource').main },
	{name: 'example-function', main: require('./../lib/src-server/example-function').main },
	{name: 'example-timer-keep-alive', main: require('./../lib/src-server/example-timer-keep-alive').main },
	{name: 'example-timer', main: require('./../lib/src-server/example-timer').main }
];

module.exports = require('./../lib/src-server/test-main').serve(functions);