/**
 * Base Interface Class defines multiple abstract Traits
 * @abstract
 */
class Interface {
	/**
	 * Checks if the given value is correct
	 * @param {unknown} value - The value to check
	 * @returns {boolean}
	 * @abstract
	 */
	static is(value) { }

	/**
	 * Check if a given value is correct and throw an error if not
	 * @param {unknown} value - The value to check
	 * @param {string} [varName="value"] - The name of the variable to use in the error message
	 * @returns {void}
	 * @abstract
	 */
	static verify(value, varName = 'value') { }
}

module.exports = { Interface };