const { Interface } = require('./Interface.class');
const { Position } = require('./Position.class');

/**
 * @typedef {{line: number, column: number}} PositionInterface
 * @typedef {{start: PositionInterface, end: PositionInterface}} LocationInterface
 */

class Location extends Interface {
	/**
	 * Checks if the given value is correct
	 * @param {LocationInterface} value - The value to check. Line and Column have to be positive Integers greater than 0.
	 * @returns {boolean}
	 */
	static is(value) {
		try {
			Location.verify(value);
			return true;
		}
		catch (error) {
			return false;
		}
	}

	/**
	 * Check if a given value is correct and throw an error if not
	 * @param {LocationInterface} value - The value to check. Line and Column have to be positive Integers greater than 0.
	 * @param {string} varName - The name of the variable to use in the error message
	 * @returns {void}
	 */
	static verify(value, varName = 'value') {
		if (!Object.prototype.toString.call(value) === '[object Object]')
			throw new TypeError(`Expected ${varName} to be an Object`);

		Position.verify(value.start, `${varName}.start`);
		Position.verify(value.end, `${varName}.end`);

		if (value.start.line > value.end.line)
			throw new TypeError(`Expected ${varName}.start.line to be smaller than ${varName}.end.line`);

		if (value.start.line === value.end.line && value.start.column > value.end.column)
			throw new TypeError(`Expected ${varName}.start.column to be smaller than ${varName}.end.column`);
	}

	/**
	 * Create a new Location from an Offset
	 * @param {string} offset - The offset for the new Location. Has to be a non-empty String
	 * @returns {LocationInterface} - The new Location
	 */
	static createLocation(offset) {
		if (typeof offset !== 'string' || offset.length === 0)
			throw new TypeError('Expected offset to be a non-empty String');

		const lines = offset.split(/\r\n|\r|\n/);

		return {
			start: { line: 1, column: 1 },
			end: {
				line: lines.length,
				column: lines.length === 1 ? lines[0].length : lines[lines.length - 1].length
			}
		};
	}

	/**
	 * Calculate a new Location based on the previous Location and an Offset
	 * @param {LocationInterface} previousLocation - The previous Location
	 * @param {string} offset - The offset for the new Location. Has to be a non-empty String
	 * @returns {LocationInterface} - The new Location
	 */
	 static calculateLocation(previousLocation, offset) {
		if(!Object.prototype.toString.call(previousLocation) === '[object Object]')
			throw new TypeError('Expected previousLocation to be an Object');

		Position.verify(previousLocation.start, 'previousLocation.start');
		Position.verify(previousLocation.end, 'previousLocation.end');

		const lines = offset.split(/\r\n|\r|\n/).filter(line => line.length > 0);

		if (lines.length === 0)
			return {
				start: { line: previousLocation.end.line, column: previousLocation.end.column + offset.length },
				end: { line: previousLocation.end.line, column: previousLocation.end.column + offset.length }
			};

		return {
			start: { line: previousLocation.end.line, column: previousLocation.end.column + 1 },
			end: lines.length === 1 ?
				{ line: previousLocation.end.line, column: previousLocation.end.column + lines[0].length } :
				{ line: previousLocation.end.line + lines.length - 1, column: lines[lines.length - 1].length }
		};
	}
}

module.exports = { Location };