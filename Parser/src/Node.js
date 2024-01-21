class Node {
	#type;
	#raw;
	#children;
	#range;

	/**
	 * Create a new Node Instance from JSON Data
	 * @param {unknown} data
	 * @param {string} [varName='node']
	 * @returns {Node}
	 */
	static fromJSON(data, varName = 'node') {
		if (typeof varName !== 'string')
			throw new TypeError('Expected varName to be a String');

		if (Object.prototype.toString.call(data) !== '[object Object]')
			throw new TypeError(`Expected ${varName} to be an Object`);

		if ((typeof data.type !== 'string'))
			throw new TypeError(`Expected ${varName}.type to be a String`);

		if (!['MATCH', 'RECOVER'].includes(data.type.toUpperCase()))
			throw new RangeError(`Expected ${varName}.type to be either "MATCH" or "RECOVER"`);

		if (typeof data.raw !== 'string')
			throw new TypeError(`Expected ${varName}.raw to be a String`);

		if (Object.prototype.toString.call(data.children) !== '[object Object]')
			throw new TypeError(`Expected ${varName}.children to be an Object`);

		const children = Object.entries(data.children).reduce((result, [name, child]) => {
			if (!Array.isArray(child))
				throw new TypeError(`Expected ${varName}.children.${name} to be an Array`);

			return {
				...result,
				[name]: child.map((child, index) => Node.fromJSON(child, `${varName}.children.${name}[${index}]`))
			};
		}, {});

		if (!Array.isArray(data.range))
			throw new TypeError(`Expected ${varName}.range to be an Array`);

		if (data.range.length !== 2)
			throw new RangeError(`Expected ${varName}.range to be an Array of length 2`);

		data.range.forEach((value, index) => {
			if (!Number.isSafeInteger(value))
				throw new TypeError(`Expected ${varName}.range[${index}] to be an Integer`);

			if (value < 0)
				throw new RangeError(`Expected ${varName}.range[${index}] to be greater than or equal to 0`);
		});

		return new Node(
			data.type,
			data.raw,
			children,
			[data.range[0], data.range[1]]
		);
	}

	/**
	 * Create a new Node Instance
	 * @param {"MATCH" | "RECOVER"} type 
	 * @param {string} raw 
	 * @param {{[key: string]: Node[]}} children 
	 * @param {[number, number]} range
	 */
	constructor(type, raw, children, range) {
		if (typeof type !== 'string')
			throw new TypeError('Expected type to be a String');

		if (!['MATCH', 'RECOVER'].includes(type.toUpperCase()))
			throw new RangeError('Expected type to be either "MATCH" or "RECOVER"');

		if (typeof raw !== 'string')
			throw new TypeError('Expected raw to be a String');

		if (Object.prototype.toString.call(children) !== '[object Object]')
			throw new TypeError('Expected children to be an Object');

		Object.entries(children).forEach(([name, child]) => {
			if (!Array.isArray(child))
				throw new TypeError(`Expected children.${name} to be an Array`);

			child.forEach((child, index) => {
				if (!(child instanceof Node))
					throw new TypeError(`Expected children.${name}[${index}] to be an instance of Node`);
			});
		});

		if (!Array.isArray(range))
			throw new TypeError('Expected range to be an Array');

		if (range.length !== 2)
			throw new RangeError('Expected range to be an Array of length 2');

		range.forEach((value, index) => {
			if (!Number.isSafeInteger(value))
				throw new TypeError(`Expected range[${index}] to be an Integer`);

			if (value < 0)
				throw new RangeError(`Expected range[${index}] to be greater than or equal to 0`);
		});

		this.#type = type;
		this.#raw = raw;
		this.#children = children;
		this.#range = range;
	}

	/**
	 * Get the type of the Node
	 * @returns {"MATCH" | "RECOVER"}
	 */
	get type() {
		return this.#type;
	}

	/**
	 * Get the raw value of the Node
	 * @returns {string}
	 */
	get raw() {
		return this.#raw;
	}

	/**
	 * Get the children of the Node
	 * @returns {{[key: string]: Node[]}}
	 */
	get children() {
		return { ...this.#children }
	}

	/**
	 * Get the range of the Node
	 * @returns {[number, number]}
	 */
	get range() {
		return [...this.#range];
	}

	/**
	 * Convert the Node to JSON
	 * @returns {string}
	 */
	toJSON() {
		return {
			type: this.#type,
			raw: this.#raw,
			children: Object.entries(this.#children)
				.reduce((children, [name, child]) => {
					return { ...children, [name]: child.map(child => child.toJSON()) };
				}, {}),
			range: this.#range
		};
	}
}

module.exports = { Node };