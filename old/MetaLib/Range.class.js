const { Interface } = require('./Interface.class');

/**
 * @typedef {{start: number, end: number}} RangeInterface
 */

class Range extends Interface {
	/**
	 * Checks if the given value is correct
	 * @param {RangeInterface} value - The value to check. Start and End have to be positive Integers.
	 * @returns {boolean}
	 */
	static is(value) {
		try {
			Range.verify(value);
			return true;
		}
		catch (error) {
			return false;
		}
	}

	/**
	 * Check if a given value is correct and throw an error if not
	 * @param {RangeInterface} value - The value to check. Start and End have to be positive Integers.
	 * @param {string} varName - The name of the variable to use in the error message
	 * @returns {void}
	 */
	static verify(value, varName = 'value') {
		if (!Object.prototype.toString.call(value) === '[object Object]')
			throw new TypeError(`Expected ${varName} to be an Object`);

		if (!Number.isSafeInteger(value.start) || value.start < 0)
			throw new TypeError(`Expected ${varName}.start to be a positive Integer`);

		if (!Number.isSafeInteger(value.end) || value.end < 0)
			throw new TypeError(`Expected ${varName}.end to be a positive Integer`);

		if (value.start > value.end)
			throw new RangeError(`Expected ${varName}.start to be lower than ${varName}.end`);
	}

	/**
	 * Create a new Range from an Offset
	 * @param {number | string} offset - The offset for the new Range. Can be a non-empty String or an Integer greater than 0
	 * @returns {RangeInterface}
	 */
	 static createRange(offset) {
		if (typeof offset === 'string' && offset.length > 0)
			return { start: 0, end: offset.length - 1 };
		else if (Number.isSafeInteger(offset) && offset > 0)
			return { start: 0, end: offset - 1 };
		else
			throw new TypeError('Expected offset to be a non-empty String or an Integer greater than 0');
	}

	/**
	 * Calculate a new Range based on the previous Range and an Offset
	 * @param {number | RangeInterface} previousRange - The previous Range. Can be a positive Integer or a full Range
	 * @param {number | string} offset - The offset for the new Range. Can be a non-empty String or an Integer greater than 0
	 * @returns {RangeInterface}
	 */
	static calculateRange(previousRange, offset) {
		let parsedOffset = 0;
		let previousRangeEnd = 0;

		if (typeof offset === 'string' && offset.length > 0)
			parsedOffset = offset.length;
		else if (Number.isSafeInteger(offset) && offset > 0)
			parsedOffset = offset;
		else
			throw new TypeError('Expected offset to be a non-empty String or an Integer greater than 0');

		if (Number.isSafeInteger(previousRange) && previousRange >= 0)
			previousRangeEnd = previousRange;
		else if (Range.is(previousRange)) {
			previousRangeEnd = previousRange.end;
		}
		else
			throw new TypeError('Expected previousRange to be a positive Integer or a Range');

		return {
			start: previousRangeEnd + 1,
			end: previousRangeEnd + parsedOffset
		};
	}
}

module.exports = { Range };