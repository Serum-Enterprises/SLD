/**
 * @typedef {{start: number, end: number}} RangeInterface
 * @typedef {{line: number, column: number}} PositionInterface
 * @typedef {{start: PositionInterface, end: PositionInterface, next: PositionInterface}} LocationInterface
 * @typedef {{range: RangeInterface, location: LocationInterface}} MetaInterface
 */

class Meta {
	/**
	 * Verify if meta is a valid Meta Object
	 * @param {MetaInterface} meta
	 * @param {string} [name='meta'] - An optional name for meta to use in Error Messages
	 * @static
	 */
	static verify(meta, name = 'meta') {
		if (typeof name !== 'string')
			throw new TypeError('Expected varName to be a String');

		if (Object.prototype.toString.call(meta) !== '[object Object]')
			throw new TypeError(`Expected ${name} to be an Object`);

		// Verify the Range Object
		{
			if (Object.prototype.toString.call(meta.range) !== '[object Object]')
				throw new TypeError(`Expected ${name}.range to be an Object`);

			if (!Number.isSafeInteger(meta.range.start))
				throw new TypeError(`Expected ${name}.range.start to be an Integer`);

			if (!Number.isSafeInteger(meta.range.end))
				throw new TypeError(`Expected ${name}.range.end to be an Integer`);

			if (meta.range.start < 0)
				throw new RangeError(`Expected ${name}.range.start to be greater than or equal to 0`);

			if (meta.range.end < 1)
				throw new RangeError(`Expected ${name}.range.end to be greater than or equal to 1`);

			if (meta.range.end <= meta.range.start)
				throw new RangeError(`Expected ${name}.range.end to be greater than ${name}.range.start`);
		}

		// Verify the Location Object
		{
			if (Object.prototype.toString.call(meta.location) !== '[object Object]')
				throw new TypeError(`Expected ${name}.location to be an Object`);

			// Verify the Location Start Object
			{
				if (Object.prototype.toString.call(meta.location.start) !== '[object Object]')
					throw new TypeError(`Expected ${name}.location.start to be an Object`);

				if (!Number.isSafeInteger(meta.location.start.line))
					throw new TypeError(`Expected ${name}.location.start.line to be an Integer`);

				if (!Number.isSafeInteger(meta.location.start.column))
					throw new TypeError(`Expected ${name}.location.start.column to be an Integer`);

				if (meta.location.start.line < 1)
					throw new RangeError(`Expected ${name}.location.start.line to be greater than or equal to 1`);

				if (meta.location.start.column < 1)
					throw new RangeError(`Expected ${name}.location.start.column to be greater than or equal to 1`);
			}

			// Verify the Location End Object
			{
				if (Object.prototype.toString.call(meta.location.end) !== '[object Object]')
					throw new TypeError(`Expected ${name}.location.end to be an Object`);

				if (!Number.isSafeInteger(meta.location.end.line))
					throw new TypeError(`Expected ${name}.location.end.line to be an Integer`);

				if (!Number.isSafeInteger(meta.location.end.column))
					throw new TypeError(`Expected ${name}.location.end.column to be an Integer`);

				if (meta.location.end.line < 1)
					throw new RangeError(`Expected ${name}.location.end.line to be greater than or equal to 1`);

				if (meta.location.end.column < 1)
					throw new RangeError(`Expected ${name}.location.end.column to be greater than or equal to 1`);
			}

			// Verify the Location Next Object
			{
				if (Object.prototype.toString.call(meta.location.next) !== '[object Object]')
					throw new TypeError(`Expected ${name}.location.next to be an Object`);

				if (!Number.isSafeInteger(meta.location.next.line))
					throw new TypeError(`Expected ${name}.location.next.line to be an Integer`);

				if (!Number.isSafeInteger(meta.location.next.column))
					throw new TypeError(`Expected ${name}.location.next.column to be an Integer`);

				if (meta.location.next.line < 1)
					throw new RangeError(`Expected ${name}.location.next.line to be greater than or equal to 1`);

				if (meta.location.next.column < 1)
					throw new RangeError(`Expected ${name}.location.next.column to be greater than or equal to 1`);
			}

			// Verify constraints between the Location Objects
			{
				if (meta.location.start.line > meta.location.end.line)
					throw new RangeError(`Expected ${name}.location.start.line to be less than or equal to ${name}.location.end.line`);

				if (meta.location.start.line === meta.location.end.line && meta.location.start.column > meta.location.end.column)
					throw new RangeError(`Expected ${name}.location.start.column to be less than or equal to ${name}.location.end.column`);

				if (meta.location.end.line > meta.location.next.line)
					throw new RangeError(`Expected ${name}.location.end.line to be less than or equal to ${name}.location.next.line`);

				if (meta.location.end.line === meta.location.next.line && meta.location.end.column > meta.location.next.column)
					throw new RangeError(`Expected ${name}.location.end.column to be less than or equal to ${name}.location.next.column`);
			}
		}
	}

	/**
	 * Check if meta is a valid Meta Object. Returns true if meta is a valid Meta Object; otherwise returns false
	 * @param {MetaInterface} meta
	 * @returns {boolean}
	 * @static
	 */
	static check(meta) {
		try {
			Meta.verify(meta, 'meta');
			return true;
		}
		catch (error) {
			return false;
		}
	}

	/**
	 * Create a new Meta Object from a String
	 * @param {string} source
	 * @returns {MetaInterface}
	 * @static
	 */
	static create(source) {
		if (typeof source !== 'string')
			throw new TypeError('Expected source to be a String');

		if (source.length === 0)
			throw new RangeError('Expected source to be a non-empty String');

		let currentLine = 1;
		let currentColumn = 1;
		let lineBreak = false;
		let lineBreakLength = 0;

		for (let i = 0; i < source.length; i++) {
			if (source[i] === '\r' && i + 1 < source.length && source[i + 1] === '\n') {
				lineBreak = true;
				lineBreakLength = 2;
				i++;
			}
			else if (source[i] === '\r' || source[i] === '\n') {
				lineBreak = true;
				lineBreakLength = 1;
			}
			else {
				if (lineBreak) {
					currentLine++;
					currentColumn = 1;
					lineBreak = false;
					lineBreakLength = 0;
				}
				else {
					currentColumn++;
				}
			}
		}

		if (lineBreak) {
			return {
				range: {
					start: 0,
					end: source.length - 1,
				},
				location: {
					start: { line: 1, column: 1 },
					end: { line: currentLine, column: currentColumn + lineBreakLength },
					next: { line: currentLine + 1, column: 1 }
				}
			}
		}
		else {
			return {
				range: {
					start: 0,
					end: source.length - 1,
				},
				location: {
					start: { line: 1, column: 1 },
					end: { line: currentLine, column: currentColumn },
					next: { line: currentLine, column: currentColumn + 1 }
				}
			};
		}
	}

	/**
	 * Calculates a new Meta Object based on a preceding Meta Object and a String.
	 * @param {MetaInterface} precedingMeta
	 * @param {string} source
	 * @returns {MetaInterface}
	 * @static
	 */
	static calculate(precedingMeta, source) {
		Meta.verify(precedingMeta, 'precedingMeta');

		if (typeof source !== 'string')
			throw new TypeError('Expected source to be a String');

		if (source.length === 0)
			throw new RangeError('Expected source to be a non-empty String');

		let currentLine = precedingMeta.location.next.line;
		let currentColumn = precedingMeta.location.next.column;
		let lineBreak = false;
		let lineBreakLength = 0;

		for (let i = 0; i < source.length; i++) {
			if (source[i] === '\r' && i + 1 < source.length && source[i + 1] === '\n') {
				lineBreak = true;
				lineBreakLength = 2;
				i++;
			}
			else if (source[i] === '\r' || source[i] === '\n') {
				lineBreak = true;
				lineBreakLength = 1;
			}
			else {
				if (lineBreak) {
					currentLine++;
					currentColumn = 1;
					lineBreak = false;
					lineBreakLength = 0;
				}
				else {
					currentColumn++;
				}
			}
		}

		if (lineBreak) {
			return {
				range: {
					start: precedingMeta.range.end + 1,
					end: precedingMeta.range.end + source.length - 1
				},
				location: {
					start: precedingMeta.location.next,
					end: { line: currentLine, column: currentColumn + lineBreakLength },
					next: { line: currentLine + 1, column: 1 }
				}
			}
		}
		else {
			return {
				range: {
					start: precedingMeta.range.end + 1,
					end: precedingMeta.range.end + source.length - 1
				},
				location: {
					start: precedingMeta.location.next,
					end: { line: currentLine, column: currentColumn },
					next: { line: currentLine, column: currentColumn + 1 }
				}
			};
		}
	}
}

module.exports = Meta;