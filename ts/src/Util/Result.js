const { Some, None } = require('./Option');
const { panic } = require('./panic');

class Result {
	static Ok(value) {
		return new Ok(value);
	}

	static Err(error) {
		return new Err(error);
	}

	isOk() {
		return (this instanceof Ok);
	}
	isErr() {
		return (this instanceof Err);
	}

	isOkAnd(predicate) {
		return (this instanceof Ok) && predicate(this.value);
	}
	isErrAnd(predicate) {
		return (this instanceof Err) && predicate(this.error);
	}

	OkToOption() {
		return (this instanceof Ok) ? new Some(this.value) : new None();
	}
	ErrToOption() {
		return (this instanceof Err) ? new Some(this.error) : new None();
	}

	expectOk(error) {
		if (!(this instanceof Ok))
			panic(error);
	}
	expectErr(error) {
		if (!(this instanceof Err))
			panic(error);
	}

	expectOkOr(defaultValue) {
		return (this instanceof Ok) ? this.value : defaultValue;
	}
	expectErrOr(defaultValue) {
		return (this instanceof Err) ? this.error : defaultValue;
	}

	mapOk(fn) {
		return (this instanceof Ok) ? Result.Ok(fn(this.value)) : Result.Err(this.error);
	}
	mapErr(fn) {
		return (this instanceof Err) ? Result.Err(fn(this.error)) : Result.Ok(this.value);
	}

	match(onOk, onErr) {
		return (this instanceof Ok) ? onOk(this.value) : onErr(this.error);
	}
}

class Ok extends Result {
	#value;

	constructor(value) {
		super();
		this.#value = value;
	}

	get value() {
		return this.#value;
	}
}

class Err extends Result {
	#error;

	constructor(error) {
		super();
		this.#error = error;
	}

	get error() {
		return this.#error;
	}
}

module.exports = { Result, Ok, Err };