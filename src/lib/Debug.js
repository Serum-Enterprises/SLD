class Debug {
	static #lastTime;
	#namespace;

	static create(namespace) {
		return new Debug(namespace);
	}

	constructor(namespace) {
		if (typeof namespace !== 'string')
			throw new TypeError('Expected namespace to be a String');

		this.#namespace = namespace;
	}

	#diff() {
		if (!Debug.#lastTime) {
			Debug.#lastTime = process.hrtime.bigint();

			return null;
		}
		else {
			const diff = process.hrtime.bigint() - Debug.#lastTime;
			Debug.#lastTime = process.hrtime.bigint();

			return `${diff / 1000000n} ms`
		}
	}

	log(message) {
		if (typeof message !== 'string')
			throw new TypeError('Expected message to be a String');

		const diff = this.#diff();

		console.log(`[${this.#namespace}] ${message}${diff ? ` +${diff}` : ''}`);
	}

	warn(message) {
		if (typeof message !== 'string')
			throw new TypeError('Expected message to be a String');

		const diff = this.#diff();

		console.warn(`[${this.#namespace}] ${message}${diff ? ` +${diff}` : ''}`);
	}

	error(message) {
		if (typeof message !== 'string')
			throw new TypeError('Expected message to be a String');

		const diff = this.#diff();

		console.error(`[${this.#namespace}] ${message}${diff ? ` +${diff}` : ''}`);
	}

	extend(namespace) {
		return new Debug(`${this.#namespace}:${namespace}`);
	}
}

module.exports = Debug;