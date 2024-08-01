const { AnyType } = require('./Any');

class InterfaceType extends AnyType {
	#schema;

	constructor(schema) {
		if (Object.prototype.toString.call(schema) !== '[object Object]')
			throw new TypeError('Expected Interface Schema to be an Interface (Object)');

		Object.entries(schema).forEach(([key, type]) => {
			if (typeof key !== 'string')
				throw new TypeError('Expected Interface Schema Keys to be Strings');

			if (!(type instanceof AnyType))
				throw new TypeError(`Expected Interface Schema Type at Key ${key} to be a valid Type`);
		});

		super();
		this.#schema = schema;
	}

	get type() {
		return this.#schema;
	}

	validate(value, varName = 'value') {
		if (typeof varName !== 'string')
			throw new TypeError('Expected varName to be a String');

		if (Object.prototype.toString.call(value) !== '[object Object]')
			throw new TypeError(`Expected ${varName} to be an Interface (Object)`);

		Object.entries(this.#schema).forEach(([key, type]) => {
			type.validate(value[key], `${varName}.${key}`);
		});

		super.validate(value, varName);
	}
}

class ObjectType extends AnyType {
	#type;

	constructor(type) {
		if (!(type instanceof AnyType))
			throw new TypeError('Expected Object Type to be a valid Type');

		super();
		this.#type = type;
	}

	get type() {
		return this.#type;
	}

	validate(value, varName = 'value') {
		if (typeof varName !== 'string')
			throw new TypeError('Expected varName to be a String');

		if (Object.prototype.toString.call(value) !== '[object Object]')
			throw new TypeError(`Expected ${varName} to be an Object`);

		const entries = Object.entries(value);

		entries.forEach(([key, item]) => {
			this.#type.validate(item, `${varName}.${key}`);
		});

		super.validate(value, varName);
	}
}

class ArrayType extends AnyType {
	#type;

	constructor(type) {
		if (!(type instanceof AnyType))
			throw captureStackTrace(new TypeError('Expected Array Type to be a valid Type'), ArrayType);

		super();
		this.#type = type;
	}

	get type() {
		return this.#type;
	}

	validate(value, varName = 'value') {
		if (typeof varName !== 'string')
			throw new TypeError('Expected varName to be a String');

		if (!Array.isArray(value))
			throw new TypeError(`Expected ${varName} to be an Array`);

		value.forEach((item, i) => {
			this.#type.validate(item, `${varName}[${i}]`);
		});

		super.validate(value, varName);
	}
}

class TupleType extends AnyType {
	#types = [];

	constructor(...types) {
		types.forEach((type, i) => {
			if (!(type instanceof AnyType))
				throw new TypeError(`Expected Tuple Type at Index #${i} to be a valid Type`);
		});

		super();
		this.#types = types;
	}

	get type() {
		return this.#types;
	}

	validate(value, varName = 'value') {
		if (typeof varName !== 'string')
			throw new TypeError('Expected varName to be a String');

		if (!Array.isArray(value))
			throw new TypeError(`Expected ${varName} to be a Tuple (Array)`);

		if (value.length !== this.#types.length)
			throw new RangeError(`Expected ${varName} to be a Tuple (Array) of Length ${this.#types.length}`);

		this.#types.forEach((type, i) => {
			type.validate(value[i], `${varName}[${i}]`);
		});

		super.validate(value, varName);
	}
}

module.exports = { InterfaceType, ObjectType, ArrayType, TupleType };