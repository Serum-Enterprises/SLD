class Result {
	static get Ok() { return Ok; }
	static get Err() { return Err; }

	is() {
		return this.constructor;
	}

	isOk() {
		return this instanceof Ok;
	}
	isErr() {
		return this instanceof Err;
	}

	expectOk(error) {
		if (!this.isOk())
			throw error;
	}

	expectErr(error) {
		if (!this.isErr())
			throw error;
	}

	unwrap() {
		if (this instanceof Ok)
			return this.value;
		else
			throw this.error;
	}

	unwrapOr(defaultValue) {
		return this.isOk() ? this.value : defaultValue;
	}

	map(fn) {
		return this.isOk() ? new Ok(fn(this.value)) : new Err(this.error);
	}

	match(onOk, onErr) {
		return this.isOk() ? onOk(this.value) : onErr(this.error);
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

module.exports = { Result };