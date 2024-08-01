class Option {
	static get Some() {
		return Some;
	}
	static get None() {
		return None;
	}

	is() {
		return this.constructor;
	}

	isSome() {
		return this instanceof Some;
	}
	isNone() {
		return this instanceof None;
	}

	expectSome(error) {
		if (!this.isSome())
			throw error;
	}

	expectNone(error) {
		if (!this.isNone())
			throw error;
	}

	unwrap(error) {
		if (this.isSome())
			return this.value;
		else
			throw error;
	}

	unwrapOr(defaultValue) {
		return this.isSome() ? this.value : defaultValue;
	}

	map(fn) {
		return this.isSome() ? new Some(fn(this.value)) : new None();
	}

	match(onSome, onNone) {
		return this.isSome() ? onSome(this.value) : onNone();
	}
}

class Some extends Option {
	#value;

	constructor(value) {
		super();
		this.#value = value;
	}

	get value() {
		return this.#value;
	}
}

class None extends Option { }

module.exports = { Option };