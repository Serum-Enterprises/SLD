const { AnyType } = require('./Any');

class IntersectType extends AnyType {
	#types = [];

	constructor(...types) {
		types.forEach((type, i) => {
			if (!(type instanceof AnyType))
				throw new TypeError(`Expected Intersect Type at Index #${i} to be a valid Type`);
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

		this.#types.forEach(type => {
			type.validate(value, varName);
		});

		super.validate(value, varName);
	}
}

class UnionType extends AnyType {
	#types = [];

	constructor(...types) {
		types.forEach((type, i) => {
			if (!(type instanceof AnyType))
				throw captureStackTrace(new TypeError(`Expected Union Type at Index #${i} to be a valid Type`), UnionType);
		});

		super();
		this.#types = types;
	}

	get type() {
		return this.#types;
	}

	validate(value, varName = 'value') {
		if (typeof varName !== 'string')
			throw captureStackTrace(new TypeError('Expected varName to be a String'), this.validate);

		const errors = [];

		this.#types.forEach(type => {
			try {
				type.validate(value, varName);
			}
			catch (err) {
				errors.push(err);
			}
		});

		if (errors.length !== 0)
			throw captureStackTrace(new TypeError(`Expected ${varName} to be one of the Union Types`, { cause: errors }), this.validate);

		super.validate(value, varName);
	}
}

class InstanceOfType extends AnyType {
	#constructorFunction;
	#name;

	constructor(constructorFunction, name) {
		if (typeof instanceConstructor !== 'function')
			throw new TypeError('Expected constructorFunction to be a Constructor Function');

		if (typeof name !== 'string')
			throw new TypeError('Expected name to be a String');

		super();
		this.#constructorFunction = constructorFunction;
		this.#name = name;
	}

	get constructorFunction() {
		return this.#constructorFunction;
	}

	get name() {
		return this.#name;
	}

	validate(value, varName = 'value') {
		if (typeof varName !== 'string')
			throw new TypeError('Expected varName to be a String');

		if (!(value instanceof this.#constructorFunction))
			throw new TypeError(`Expected ${varName} to be an Instance of ${this.#name}`);

		super.validate(value, varName);
	}
}

module.exports = { IntersectType, UnionType, InstanceType: InstanceOfType };