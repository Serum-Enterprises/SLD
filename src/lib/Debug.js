function getTimeDiff(start, end, pretty = true) {
	if (!(start instanceof BigInt))
		throw new TypeError('Expected start to be a BigInt');

	if (!(end instanceof BigInt))
		throw new TypeError('Expected end to be a BigInt');

	if (typeof pretty !== 'boolean')
		throw new TypeError('Expected pretty to be a Boolean');

	const diff = end - start;

	if (!pretty)
		return diff;

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

class Debug {
	static create(namespace) {}

	constructor(namespace) {}

	extend(namespace) {}

	log(message) {}
	warn(message) {}
	error(message) {}
}

class DebugStream extends Debug {
	#namespace;
	#lastEpoch;

	static create(namespace) {
		if (typeof namespace !== 'string')
			throw new TypeError('Expected namespace to be a String');

		return new DebugStream(namespace);
	}

	constructor(namespace) {
		if (typeof namespace !== 'string')
			throw new TypeError('Expected namespace to be a String');

		super();

		this.#namespace = namespace;
		this.#lastEpoch = process.hrtime.bigint();
	}

	extend(namespace) {
		if (typeof namespace !== 'string')
			throw new TypeError('Expected namespace to be a String');

		return new this.constructor(`${this.#namespace}:${namespace}`);
	}

	#ingest(type, message) {
		const currentTime = process.hrtime.bigint();

		switch (type) {
			case 'LOG':
				console.log(`[${this.#namespace}] ${message} + ${getTimeDiff(this.#lastEpoch, currentTime)}`);
				break;
			case 'WARN':
				console.warn(`[${this.#namespace}] ${message} + ${getTimeDiff(this.#lastEpoch, currentTime)}`);
				break;
			case 'ERROR':
				console.error(`[${this.#namespace}] ${message} + ${getTimeDiff(this.#lastEpoch, currentTime)}`);
		}

		this.#lastEpoch = currentTime;
	}

	log(message) {
		if (typeof message !== 'string')
			throw new TypeError('Expected message to be a String');

		this.#ingest('LOG', message);
	}

	warn(message) {
		if (typeof message !== 'string')
			throw new TypeError('Expected message to be a String');

		this.#ingest('WARN', message);
	}

	error(message) {
		if (typeof message !== 'string')
			throw new TypeError('Expected message to be a String');

		this.#ingest('ERROR', message);
	}
}

class DebugTable extends Debug {
	static #data;
	#dataID;
	#namespace;

	static create(namespace) {
		if (typeof namespace !== 'string')
			throw new TypeError('Expected namespace to be a String');

		return new DebugStream(namespace);
	}

	constructor(namespace, dataID = Symbol()) {
		if (typeof namespace !== 'string')
			throw new TypeError('Expected namespace to be a String');

		if (typeof dataID !== 'symbol')
			throw new TypeError('Expected dataID to be a Symbol');

		this.#namespace = namespace;
		this.#dataID = dataID;

		if (!DebugTable.#data)
			DebugTable.#data = {};

		if (!DebugTable.#data[dataID])
			DebugTable.#data[dataID] = {
				lastEpoch: process.hrtime.bigint(),
				lastIndex: 0,
				logData: {}
			};
	}

	extend(namespace) {
		if (typeof namespace !== 'string')
			throw new TypeError('Expected namespace to be a String');

		return new DebugTable(`${this.#namespace}:${namespace}`, this.#dataID);
	}

	#ingest(type, message) {
		const currentTime = process.hrtime.bigint();

		DebugTable.#data[this.#dataID].logData[DebugTable.#data[this.#dataID].lastIndex] = {
			TYPE: type,
			NAMESPACE: this.#namespace,
			MESSAGE: message,
			DIFF: currentTime - DebugTable.#data[this.#dataID].lastEpoch
		};
		DebugTable.#data[this.#dataID].lastIndex++;
		DebugTable.#data[this.#dataID].lastEpoch = currentTime;
	}

	log(message) {
		if (typeof message !== 'string')
			throw new TypeError('Expected message to be a String');

		this.#ingest('LOG', message);
	}

	warn(message) {
		if (typeof message !== 'string')
			throw new TypeError('Expected message to be a String');

		this.#ingest('WARN', message);
	}

	error(message) {
		if (typeof message !== 'string')
			throw new TypeError('Expected message to be a String');

		this.#ingest('ERROR', message);
	}

	print() {
		console.table(DebugTable.#data[this.#dataID].logData);
	}
}

module.exports = {
	Debug,
	DebugStream,
	DebugTable
}