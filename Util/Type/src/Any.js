class AnyType {
	#constraint = null;

	constraint(fn) {
		if (typeof fn !== 'function')
			throw new TypeError('Expected fn to be a Function');

		this.#constraint = fn;

		return this;
	}

	validate(value, varName = 'value') {
		if (typeof varName !== 'string')
			throw new TypeError('Expected varName to be a String');

		if (this.#constraint !== null)
			this.#constraint(value, varName);
	}
}

module.exports = { AnyType };