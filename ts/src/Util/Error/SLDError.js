class SLDError extends Error {
	#location;

	constructor(location, message, options) {
		super(message, options);
		this.#location = location;
	}

	get location() {
		return this.#location;
	}
}

module.exports = { SLDError };