class Result {
	static get Ok() { return Ok; }
	static get Err() { return Err; }

	isOk() {
		return this instanceof Ok;
	}

	isErr() {
		return this instanceof Err;
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