class Debug {
	#namespace;

	constructor(namespace) {
		if(typeof namespace !== 'string')
			throw new TypeError('Expected namespace to be a String');

		this.#namespace = namespace;
	}

	#getDebugStatus() {
		if(process.env.DEBUG === 'false')
			return false;

		if(process.env.NODE_ENV === 'production')
			return false;

		return true;
	}

	extend(namespace) {
		if(typeof namespace !== 'string')
			throw new TypeError('Expected namespace to be a String');

		return new Debug(`${this.#namespace}:${namespace}`);
	}

	#print(printFunction, message) {
		if(this.#getDebugStatus()) {
			if(typeof message === 'string')
				message.split('\n').forEach(line => printFunction(`[${this.#namespace}] ${line}`));
			else if(message instanceof Error)
				message.stack.split('\n').forEach(line => printFunction(`[${this.#namespace}] ${line}`));
			else if(Util.isJSON(message))
				JSON.stringify(message, null, 4)
					.split('\n')
					.forEach(line => printFunction(`[${this.#namespace}] ${line}`));
			else
				throw new TypeError('Expected message to be a String, JSON or an instance of Error');
		}

		return this;
	}

	log(message) {
		return this.#print(console.log, message);
	}

	warn(message) {
		return this.#print(console.warn, message);
	}

	error(message) {
		return this.#print(console.error, message);
	}
}

module.exports = Debug;