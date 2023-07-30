class Debug {
	static #data;
	#dataID;
	#stream;
	#namespace;

	static formatDiff(diff) {
		if (typeof diff !== 'bigint')
			throw new TypeError('Expected diff to be a BigInt');

		if (diff >= 31536000000000000n)
			return `~${diff / 31536000000000000n} y`;

		if (diff >= 86400000000000n)
			return `~${diff / 86400000000000n} d`;

		if (diff >= 60000000000n)
			return `~${diff / 60000000000n} m`;

		if (diff >= 1000000000n)
			return `~${diff / 1000000000n} s`;

		if (diff >= 1000000n)
			return `~${diff / 1000000n} ms`;

		if (diff >= 1000n)
			return `~${diff / 1000n} µs`;

		return ` ${diff} ns`;
	}

	static create(namespace, stream = true) {
		if (typeof namespace !== 'string')
			throw new TypeError('Expected namespace to be a String');

		if (typeof stream !== 'boolean')
			throw new TypeError('Expected stream to be a Boolean');

		return new Debug(namespace, stream);
	}

	constructor(namespace, stream = true, dataID = Symbol()) {
		if (typeof namespace !== 'string')
			throw new TypeError('Expected namespace to be a String');

		if (typeof stream !== 'boolean')
			throw new TypeError('Expected stream to be a Boolean');

		if (typeof dataID !== 'symbol')
			throw new TypeError('Expected dataID to be a Symbol');

		this.#namespace = namespace;
		this.#stream = stream;
		this.#dataID = dataID;

		if (!Debug.#data)
			Debug.#data = {};

		if (!Debug.#data[dataID])
			Debug.#data[dataID] = {
				lastEpoch: process.hrtime.bigint(),
				lastIndex: 0,
				logData: {}
			};
	}

	extend(namespace) {
		if (typeof namespace !== 'string')
			throw new TypeError('Expected namespace to be a String');

		return new Debug(`${this.#namespace}:${namespace}`, this.#stream, this.#dataID);
	}

	#ingest(type, message) {
		const currentTime = process.hrtime.bigint();
		const diff = currentTime - Debug.#data[this.#dataID].lastEpoch;
		Debug.#data[this.#dataID].lastEpoch = currentTime;

		if (this.#stream)
			return console[type](`[${this.#namespace}] ${message} ${Debug.formatDiff(diff)}`);

		Debug.#data[this.#dataID].logData[Debug.#data[this.#dataID].lastIndex] = {
			TYPE: type,
			NAMESPACE: this.#namespace,
			MESSAGE: message,
			DIFF: Debug.formatDiff(diff),
			NSDIFF: diff,
		};
		Debug.#data[this.#dataID].lastIndex++;
	}

	log(message) {
		if (typeof message !== 'string')
			throw new TypeError('Expected message to be a String');

		this.#ingest('log', message);

		return this;
	}

	warn(message) {
		if (typeof message !== 'string')
			throw new TypeError('Expected message to be a String');

		this.#ingest('warn', message);

		return this;
	}

	error(message) {
		if (typeof message !== 'string')
			throw new TypeError('Expected message to be a String');

		this.#ingest('error', message);

		return this;
	}

	print() {
		if (this.#stream)
			console.warn(`[${this.#namespace}] Debug.print() is not supported in stream mode`);
		else
			console.table(Debug.#data[this.#dataID].logData);

		return this;
	}
}

module.exports = Debug;