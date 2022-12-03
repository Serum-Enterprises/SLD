class Debug {
	#namespace;

	constructor(namespace) {
		if(typeof namespace !== 'string')
			throw new TypeError('Expected namespace to be a String');

		this.#namespace = namespace;
	}

	extend(namespace) {
		if(typeof namespace !== 'string')
			throw new TypeError('Expected namespace to be a String');

		return new Debug(`${this.#namespace}:${namespace}`);
	}

	log(message) {
		if(typeof message === 'string')
			message.split('\n').forEach(line => console.log(`[${this.#namespace}] ${line}`));
		else if(message instanceof Error)
			message.stack.split('\n').forEach(line => console.log(`[${this.#namespace}] ${line}`));
		else
			throw new TypeError('Expected message to be a String or an instance of Error');
	}

	warn(message) {
		if(typeof message === 'string')
			message.split('\n').forEach(line => console.warn(`[${this.#namespace}] ${line}`));
		else if(message instanceof Error)
			message.stack.split('\n').forEach(line => console.warn(`[${this.#namespace}] ${line}`));
		else
			throw new TypeError('Expected message to be a String or an instance of Error');
	}

	error(message) {
		if(typeof message === 'string')
			message.split('\n').forEach(line => console.error(`[${this.#namespace}] ${line}`));
		else if(message instanceof Error)
			message.stack.split('\n').forEach(line => console.error(`[${this.#namespace}] ${line}`));
		else
			throw new TypeError('Expected message to be a String or an instance of Error');
	}
}