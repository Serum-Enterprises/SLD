const { Interface } = require('./Interface.class');

/**
 * @typedef {{line: number, column: number}} PositionInterface
 */

class Position extends Interface {
	/**
	 * Checks if the given value is correct
	 * @param {PositionInterface} value - The value to check. Line and Column have to be positive Integers greater than 0.
	 * @returns {boolean}
	 */
	static is(value) {
		try {
			Position.verify(value);
			return true;
		}
		catch (error) {
			return false;
		}
	}

	/**
	 * Check if a given value is correct and throw an error if not
	 * @param {PositionInterface} value - The value to check. Line and Column have to be positive Integers greater than 0.
	 * @param {string} varName - The name of the variable to use in the error message
	 * @returns {void}
	 */
	static verify(value, varName = 'value') {
		if (!Object.prototype.toString.call(value) === '[object Object]')
			throw new TypeError(`Expected ${varName} to be an Object`);

		if (!Number.isSafeInteger(value.line) || value.line <= 0)
			throw new TypeError(`Expected ${varName}.line to be a positive Integer`);

		if (!Number.isSafeInteger(value.column) || value.column <= 0)
			throw new TypeError(`Expected ${varName}.column to be a positive Integer`);
	}
}

module.exports = { Position };