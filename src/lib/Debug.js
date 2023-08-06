class Debug {
	static #data;
	#dataID;
	#stream;
	#namespace;

	/**
	 * Format a BigInt Time Difference according to its size
	 * @param {bigint} diff 
	 * @returns {string}
	 * @static
	 * @public
	 */
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

	/**
	 * Create a new Debug Instance
	 * @param {string} namespace 
	 * @param {boolean} [stream = true] 
	 * @returns {Debug}
	 * @static
	 * @public
	 */
	static create(namespace, stream = true) {
		if (typeof namespace !== 'string')
			throw new TypeError('Expected namespace to be a String');

		if (typeof stream !== 'boolean')
			throw new TypeError('Expected stream to be a Boolean');

		return new Debug(namespace, stream);
	}

	/**
	 * Create a new Debug Instance
	 * @param {string} namespace 
	 * @param {boolean} [stream = true] 
	 * @param {Symbol} [dataID = Symbol()]
	 * @public
	 */
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

	/**
	 * Extend this Debug Instance
	 * @param {string} namespace 
	 * @returns {Debug}
	 * @public
	 */
	extend(namespace) {
		if (typeof namespace !== 'string')
			throw new TypeError('Expected namespace to be a String');

		return new Debug(`${this.#namespace}:${namespace}`, this.#stream, this.#dataID);
	}

	/**
	 * Ingest a Message
	 * @param {'log' | 'warn' | 'error'} type 
	 * @param {string} message
	 * @private
	 */
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

	/**
	 * Log a Message to the Log Stream
	 * @param {string} message 
	 * @returns {Debug}
	 * @public
	 */
	log(message) {
		if (typeof message !== 'string')
			throw new TypeError('Expected message to be a String');

		this.#ingest('log', message);

		return this;
	}

	/**
	 * Log a Message to the Warn Stream
	 * @param {string} message 
	 * @returns {Debug}
	 * @public
	 */
	warn(message) {
		if (typeof message !== 'string')
			throw new TypeError('Expected message to be a String');

		this.#ingest('warn', message);

		return this;
	}

	/**
	 * Log a Message to the Error Stream
	 * @param {string} message 
	 * @returns {Debug}
	 * @public
	 */
	error(message) {
		if (typeof message !== 'string')
			throw new TypeError('Expected message to be a String');

		this.#ingest('error', message);

		return this;
	}

	/**
	 * Print the Data currently stored in this Instance in a Table
	 * @returns {Debug}
	 * @public
	 */
	print() {
		if (this.#stream)
			console.warn(`[${this.#namespace}] Debug.print() is not supported in stream mode`);
		else {
			console.table(Debug.#data[this.#dataID].logData);
			Debug.#data[this.#dataID].logData = {};
		}

		return this;
	}
}

module.exports = Debug;