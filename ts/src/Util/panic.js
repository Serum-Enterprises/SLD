function panic(message) {
	process.stderr.write(`Panic: ${message}\n`);

	const stack = new Error().stack.split('\n');

	for (let i = 2; i < stack.length; i++)
		process.stderr.write(`${stack[i]}\n`);

	process.exit(1);
}

module.exports = { panic };