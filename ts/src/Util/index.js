const { Result, Ok, Err } = require('./Result');
const { Option, Some, None } = require('./Option');
const { Node } = require('./Node');

function panic(message) {
	process.stderr.write(`Panic: ${message}\n`);

	const stack = new Error().stack.split('\n');

	for (let i = 2; i < stack.length; i++)
		process.stderr.write(`${stack[i]}\n`);

	process.exit(1);
}

module.exports = { Result, Ok, Err, Option, Some, None, Node, panic };