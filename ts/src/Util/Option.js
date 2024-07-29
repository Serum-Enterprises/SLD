const { Ok, Err } = require('./Result');
const { panic } = require('./panic');

class Option {
	static Some(value) {
		return new Some(value);
	}
	static None() {
		return new None();
	}

	isSome() {
		return this instanceof Some;
	}
	isNone() {
		return this instanceof None;
	}

	isSomeAnd(predicate) {
		return (this instanceof Some) && predicate(this.value);
	}

	toResult(error) {
		return (this instanceof Some) ? Ok(this.value) : Err(error);
	}

	expectSome(error) {
		if (!(this instanceof Some))
			panic(error);
	}
	expectNone(error) {
		if (!(this instanceof None))
			panic(error);
	}

	expectSomeOr(defaultValue) {
		return (this instanceof Some) ? this.value : defaultValue;
	}

	mapSome(fn) {
		return (this instanceof Some) ? Option.Some(fn(this.value)) : Option.None();
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

module.exports = { Option, Some, None };