class CloneError extends TypeError { };

class Util {
	static get CloneError() {
		return CloneError;
	}

	static isJSON(data) {
		if (data === null || typeof data === 'boolean' || Number.isFinite(data) || typeof data === 'string')
			return true;
		else if (Array.isArray(data))
			return data.every(Util.isJSON);
		else if (Object.prototype.toString.call(data) === '[object Object]')
			return Object.values(data).every(Util.isJSON);
		else
			return false;
	}

	static cloneJSON(data) {
		if (data === null || typeof data === 'boolean' || Number.isFinite(data) || typeof data === 'string')
			return data;
		else if (Array.isArray(data))
			return data.reduce((result, item) => {
				return [...result, Util.cloneJSON(item)];
			}, []);
		else if (Object.prototype.toString.call(data) === '[object Object]')
			return Object.entries(data).reduce((result, [key, value]) => {
				return { ...result, [key]: Util.cloneJSON(value) };
			}, {});
		else
			throw new CloneError('Expected data to be valid JSON');
	}
}

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
		else if(Util.isJSON(message))
			JSON.stringify(message, null, 4)
				.split('\n')
				.forEach(line => console.log(`[${this.#namespace}] ${line}`));
		else
			throw new TypeError('Expected message to be a String, JSON or an instance of Error');
	}

	warn(message) {
		if(typeof message === 'string')
			message.split('\n').forEach(line => console.warn(`[${this.#namespace}] ${line}`));
		else if(message instanceof Error)
			message.stack.split('\n').forEach(line => console.warn(`[${this.#namespace}] ${line}`));
		else if(Util.isJSON(message))
			JSON.stringify(message, null, 4)
				.split('\n')
				.forEach(line => console.warn(`[${this.#namespace}] ${line}`));
		else
			throw new TypeError('Expected message to be a String, JSON or an instance of Error');
	}

	error(message) {
		if(typeof message === 'string')
			message.split('\n').forEach(line => console.error(`[${this.#namespace}] ${line}`));
		else if(message instanceof Error)
			message.stack.split('\n').forEach(line => console.error(`[${this.#namespace}] ${line}`));
		else if(Util.isJSON(message))
			JSON.stringify(message, null, 4)
				.split('\n')
				.forEach(line => console.error(`[${this.#namespace}] ${line}`));
		else
			throw new TypeError('Expected message to be a String, JSON or an instance of Error');
	}
}

module.exports = Debug;