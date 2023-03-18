function isJSON(data) {
	if (data === null || typeof data === 'boolean' || Number.isFinite(data) || typeof data === 'string')
		return true;
	else if (Array.isArray(data))
		return data.every(isJSON);
	else if (Object.prototype.toString.call(data))
		return Object.values(data).every(isJSON);

	return false;
}

function cloneJSON(data) {
	if (data === null || typeof data === 'boolean' || Number.isFinite(data) || typeof data === 'string')
		return data;
	else if (Array.isArray(data))
		return data.map(cloneJSON);
	else if (Object.prototype.toString.call(data))
		return Object.entries().reduce((obj, [key, value]) => {
			return { ...obj, [key]: cloneJSON(value) }
		}, {});

	return undefined;
}

/**
 * Base Interface Class defines multiple abstract Traits
 * @abstract
 */
class Interface {
	/**
	 * Checks if the given value is correct
	 * @param {unknown} value - The value to check
	 * @param {string} [varName="value"] - The name of the variable to use in the error message
	 * @returns {boolean}
	 * @abstract
	 */
	static is(value, varName = 'value') {}

	/**
	 * Check if a given value is correct and throw an error if not
	 * @param {unknown} value - The value to check
	 * @param {string} [varName="value"] - The name of the variable to use in the error message
	 * @returns {void}
	 * @abstract
	 */
	static verify(value, varName = 'value') {}
}

class Range {
	/**
	 * Create a new Range from an Offset
	 * @param {number | string} offset - The offset for the new Range, can be a String or a positive Integer
	 * @returns {{start: number, end: number}}
	 */
	static createRange(offset) {
		if (typeof offset === 'string')
			return { start: 0, end: offset.length - 1 };
		else if (Number.isSafeInteger(offset) && offset >= 0)
			return { start: 0, end: offset - 1 };
		else
			throw new TypeError('Expected offset to be a String or a positive Integer');
	}

	/**
	 * Calculate a new Range based on the previous Range and an Offset
	 * @param {number | {start: number, end: number}} previousRange - The previous Range. Can be the end of a Range (number) or a full Range
	 * @param {number | string} offset - The offset for the new Range, can be a String or a positive Integer
	 * @returns {{start: number, end: number}}
	 */
	static calculateRange(previousRange, offset) {
		let parsedOffset = 0;
		let previousRangeEnd = 0;

		if (typeof offset === 'string')
			parsedOffset = offset.length;
		else if (Number.isSafeInteger(offset) && offset >= 0)
			parsedOffset = offset;
		else
			throw new TypeError('Expected offset to be a String or a positive Integer');

		if (Number.isSafeInteger(previousRange) && previousRange >= 0)
			previousRangeEnd = previousRange;
		else if (Object.prototype.toString.call(previousRange) === '[object Object]') {
			if (!(Number.isSafeInteger(previousRange.start) && previousRange.start >= 0))
				throw new TypeError('Expected previousRange.start to be a positive Integer');

			if (!(Number.isSafeInteger(previousRange.end) && previousRange.end >= 0))
				throw new TypeError('Expected previousRange.end to be a positive Integer');

			if (previousRange.start > previousRange.end)
				throw new RangeError('Expected previousRange.start to be less than or equal to previousRange.end');

			previousRangeEnd = previousRange.end;
		}
		else
			throw new TypeError('Expected previousRange to be a positive Integer or an Object with a property end that is a positive Integer');

		return {
			start: previousRangeEnd + 1,
			end: previousRangeEnd + parsedOffset
		};
	}
}

class Location {
	/**
	 * Create a new Location from an Offset
	 * @param {string} offset - The offset for the new Location. Has to be a non-empty String
	 * @returns {{start: {line: number, column: number}, end: {line: number, column: number}}} - The new Location
	 */
	static createLocation(offset) {
		if (typeof string !== 'string' || string.length === 0)
			throw new TypeError('Expected string to be a non-empty String');

		const lines = string.split(/\r\n|\r|\n/);

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
	 * @param {{start: {line: number, column: number}, end: {line: number, column: number}}} previousLocation - The previous Location
	 * @param {string} offset - The offset for the new Location. Has to be a non-empty String
	 * @returns {{start: {line: number, column: number}, end: {line: number, column: number}}} - The new Location
	 */
	static calculateLocation(previousLocation, offset) {
		if (typeof offset !== 'string' || offset.length === 0)
			throw new TypeError('Expected offset to be a non-empty String');

		if (Object.prototype.toString.call(previousLocation) !== '[object Object]')
			throw new TypeError('Expected previousLocation to be an Object');

		if (Object.prototype.toString.call(previousLocation.start) !== '[object Object]')
			throw new TypeError('Expected previousLocation.start to be an Object');

		if (Object.prototype.toString.call(previousLocation.end) !== '[object Object]')
			throw new TypeError('Expected previousLocation.end to be an Object');

		if (!(Number.isSafeInteger(previousLocation.start.line) && previousLocation.start.line >= 0))
			throw new TypeError('Expected previousLocation.start.line to be a positive Integer');

		if (!(Number.isSafeInteger(previousLocation.start.column) && previousLocation.start.column >= 0))
			throw new TypeError('Expected previousLocation.start.column to be a positive Integer');

		if (!(Number.isSafeInteger(previousLocation.end.line) && previousLocation.end.line >= 0))
			throw new TypeError('Expected previousLocation.end.line to be a positive Integer');

		if (!(Number.isSafeInteger(previousLocation.end.column) && previousLocation.end.column >= 0))
			throw new TypeError('Expected previousLocation.end.column to be a positive Integer');

		if (previousLocation.start.line > previousLocation.end.line)
			throw new RangeError('Expected previousLocation.start.line to be less than or equal to previousLocation.end.line');

		if (previousLocation.start.line === previousLocation.end.line && previousLocation.start.column > previousLocation.end.column)
			throw new RangeError('Expected previousLocation.start.column to be less than or equal to previousLocation.end.column');

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

class Meta {
	static createMeta(offset) {
		if (typeof offset !== 'string' || offset.length === 0)
			throw new TypeError('Expected offset to be a non-empty String');

		return {
			location: Location.createLocation(offset),
			range: Range.createRange(offset)
		};
	}

	static calculateMeta(previousMeta, offset) {
		if (typeof offset !== 'string' || offset.length === 0)
			throw new TypeError('Expected offset to be a non-empty String');

		if (Object.prototype.toString.call(previousMeta) !== '[object Object]')
			throw new TypeError('Expected previousMeta to be an Object');

		if (Object.prototype.toString.call(previousMeta.location) !== '[object Object]')
			throw new TypeError('Expected previousMeta.location to be an Object');

		if (Object.prototype.toString.call(previousMeta.range) !== '[object Object]')
			throw new TypeError('Expected previousMeta.range to be an Object');

		return {
			location: Location.calculateLocation(previousMeta.location, offset),
			range: Range.calculateRange(previousMeta.range, offset)
		};
	}

	static verify(meta) {
		if (Object.prototype.toString.call(meta) !== '[object Object]')
			throw new TypeError('Expected meta to be an Object');

		if (Object.prototype.toString.call(meta.location) !== '[object Object]')
			throw new TypeError('Expected meta.location to be an Object');

		if (Object.prototype.toString.call(meta.range) !== '[object Object]')
			throw new TypeError('Expected meta.range to be an Object');

		if (Object.prototype.toString.call(meta.location.start) !== '[object Object]')
			throw new TypeError('Expected meta.location.start to be an Object');

		if (Object.prototype.toString.call(meta.location.end) !== '[object Object]')
			throw new TypeError('Expected meta.location.end to be an Object');

		if (!(Number.isSafeInteger(meta.location.start.line) && meta.location.start.line >= 0))
			throw new TypeError('Expected meta.location.start.line to be a positive Integer');

		if (!(Number.isSafeInteger(meta.location.start.column) && meta.location.start.column >= 0))
			throw new TypeError('Expected meta.location.start.column to be a positive Integer');

		if (!(Number.isSafeInteger(meta.location.end.line) && meta.location.end.line >= 0))
			throw new TypeError('Expected meta.location.end.line to be a positive Integer');

		if (!(Number.isSafeInteger(meta.location.end.column) && meta.location.end.column >= 0))
			throw new TypeError('Expected meta.location.end.column to be a positive Integer');

		if (meta.location.start.line > meta.location.end.line)
			throw new RangeError('Expected meta.location.start.line to be less than or equal to meta.location.end.line');

		if (meta.location.start.line === meta.location.end.line && meta.location.start.column > meta.location.end.column)
			throw new RangeError('Expected meta.location.start.column to be less than or equal to meta.location.end.column');

		if (!(Number.isSafeInteger(meta.range.start) && meta.range.start >= 0))
			throw new TypeError('Expected meta.range.start to be a positive Integer');

		if (!(Number.isSafeInteger(meta.range.end) && meta.range.end >= 0))
			throw new TypeError('Expected meta.range.end to be a positive Integer');

		if (meta.range.start > meta.range.end)
			throw new RangeError('Expected meta.range.start to be less than or equal to meta.range.end');
	}
}

class Node {
	static createNode(type, data, raw) {
		if (typeof type !== 'string' || !['SUCCESS', 'ERROR', 'RECOVER'].includes(type))
			throw new TypeError('Expected type to be a String with value "SUCCESS", "ERROR" or "RECOVER"');

		if (!isJSON(data))
			throw new TypeError('Expected data to be valid JSON');

		if (typeof raw !== 'string')
			throw new TypeError('Expected raw to be a String');

		return {
			type,
			data: cloneJSON(data),
			raw,
			meta: Meta.createMeta(raw)
		};
	}

	static calculateNode(previousNode, type, data, raw) {
		if (Object.prototype.toString.call(previousNode) !== '[object Object]')
			throw new TypeError('Expected previousNode to be an Object');

		if (Object.prototype.toString.call(previousNode.meta) !== '[object Object]')
			throw new TypeError('Expected previousNode.meta to be an Object');

		if (typeof type !== 'string' || !['SUCCESS', 'ERROR', 'RECOVER'].includes(type))
			throw new TypeError('Expected type to be a String with value "SUCCESS", "ERROR" or "RECOVER"');

		if (!isJSON(data))
			throw new TypeError('Expected data to be valid JSON');

		if (typeof raw !== 'string')
			throw new TypeError('Expected raw to be a String');

		return {
			type,
			data: cloneJSON(data),
			raw,
			meta: Meta.calculateMeta(previousNode.meta, raw)
		};
	}
}

class Result {
	static createResult(node, rest) {
		if (Object.prototype.toString.call(node) !== '[object Object]')
			throw new TypeError('Expected node to be an Object');
	}

	static calculateResult(previousResult, node) {
		if (Object.prototype.toString.call(previousResult) !== '[object Object]')
			throw new TypeError('Expected previousResult to be an Object');

		if (Object.prototype.toString.call(previousResult.nodes) !== '[object Array]')
			throw new TypeError('Expected previousResult.nodes to be an Array');

		if (Object.prototype.toString.call(previousResult.meta) !== '[object Object]')
			throw new TypeError('Expected previousResult.meta to be an Object');

		if (Object.prototype.toString.call(previousResult.meta.location) !== '[object Object]')
			throw new TypeError('Expected previousResult.meta.location to be an Object');

		if (Object.prototype.toString.call(previousResult.meta.range) !== '[object Object]')
			throw new TypeError('Expected previousResult.meta.range to be an Object');

		if (Object.prototype.toString.call(node) !== '[object Object]')
			throw new TypeError('Expected node to be an Object');

		if (Object.prototype.toString.call(node.meta) !== '[object Object]')
			throw new TypeError('Expected node.meta to be an Object');

		if (Object.prototype.toString.call(node.meta.location) !== '[object Object]')
			throw new TypeError('Expected node.meta.location to be an Object');

		if (Object.prototype.toString.call(node.meta.range) !== '[object Object]')
			throw new TypeError('Expected node.meta.range to be an Object');

		if (Object.prototype.toString.call(node.meta.location.start) !== '[object Object]')
			throw new TypeError('Expected node.meta.location.start to be an Object');

		if (Object.prototype.toString.call(node.meta.location.end) !== '[object Object]')
			throw new TypeError('Expected node.meta.location.end to be an Object');

		if (!(Number.isSafeInteger(node.meta.location.start.line) && node.meta.location.start.line >= 0))
			throw new TypeError('Expected node.meta.location.start.line to be a positive Integer');

		if (!(Number.isSafeInteger(node.meta.location.start.column) && node.meta.location.start.column >= 0))
			throw new TypeError('Expected node.meta.location.start.column to be a positive Integer');

		if
}