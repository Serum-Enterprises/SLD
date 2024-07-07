class Option {
	static get Some() {
		return Some;
	}
	static get None() {
		return None;
	}

	isSome() {
		return this instanceof Some;
	}
	isNone() {
		return this instanceof None;
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