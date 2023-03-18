const { Interface } = require('./Interface.class');
const { Location } = require('./Location.class');
const { Range } = require('./Range.class');

/**
 * @typedef {{start: number, end: number}} RangeInterface
 * @typedef {{line: number, column: number}} PositionInterface
 * @typedef {{start: PositionInterface, end: PositionInterface}} LocationInterface
 * @typedef {{location: LocationInterface, range: RangeInterface}} MetaInterface
 */

class Meta extends Interface {
	/**
	 * Checks if the given value is correct
	 * @param {MetaInterface} value
	 * @returns {boolean}
	 */
	 static is(value) {
		try {
			Meta.verify(value);
			return true;
		}
		catch (error) {
			return false;
		}
	}

	/**
	 * Check if a given value is correct and throw an error if not
	 * @param {MetaInterface} value
	 * @param {string} [varName="value"]
	 * @returns {void}
	 */
	static verify(value, varName = 'value') {
		if (!Object.prototype.toString.call(value) === '[object Object]')
			throw new TypeError(`Expected ${varName} to be an Object`);

		Location.verify(value.location, `${varName}.location`);
		Range.verify(value.range, `${varName}.range`);
	}

	/**
	 * Create a Meta based on an offset
	 * @param {string} offset 
	 * @returns {MetaInterface}
	 */
	static createMeta(offset) {
		if (typeof offset !== 'string' || offset.length === 0)
			throw new TypeError('Expected offset to be a non-empty String');

		return {
			location: Location.createLocation(offset),
			range: Range.createRange(offset)
		};
	}

	/**
	 * Calculate the Meta based on the previous Meta and an offset
	 * @param {MetaInterface} previousMeta
	 * @param {string} offset
	 * @returns {MetaInterface}
	 */
	static calculateMeta(previousMeta, offset) {
		if (typeof offset !== 'string' || offset.length === 0)
			throw new TypeError('Expected offset to be a non-empty String');

		Meta.verify(previousMeta, 'previousMeta');

		return {
			location: Location.calculateLocation(previousMeta.location, offset),
			range: Range.calculateRange(previousMeta.range, offset)
		};
	}
}

module.exports = { Meta };