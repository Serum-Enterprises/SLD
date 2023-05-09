const Meta = require('./Meta');

describe('Testing Meta', () => {
	test('Meta.create', () => {
		expect(() => Meta.create(null)).toThrow(new TypeError('Expected source to be a String'));
		expect(() => Meta.create('')).toThrow(new RangeError('Expected source to be a non-empty String'));

		expect(Meta.create('Hello\r\nWorld')).toEqual({
			range: {
				start: 0,
				end: 11
			},
			location: {
				start: {
					line: 1,
					column: 1
				},
				end: {
					line: 2,
					column: 5
				},
				next: {
					line: 2,
					column: 6
				}
			}
		});

		expect(Meta.create('Hello\r\nWorld\n')).toEqual({
			range: {
				start: 0,
				end: 12
			},
			location: {
				start: {
					line: 1,
					column: 1
				},
				end: {
					line: 2,
					column: 6
				},
				next: {
					line: 3,
					column: 1
				}
			}
		});
	});

	test('Meta.calculate', () => {
		const precedingMeta = Meta.create('Hello World\r\n');
		const source = 'How are you?\nI hope you are okay?';

		expect(() => Meta.calculate(precedingMeta, null)).toThrow(new TypeError('Expected source to be a String'));
		expect(() => Meta.calculate(precedingMeta, '')).toThrow(new TypeError('Expected source to be a non-empty String'));

		expect(Meta.calculate(precedingMeta, source)).toEqual({
			range: {
				start: 13,
				end: 44
			},
			location: {
				start: {
					line: 2,
					column: 1
				},
				end: {
					line: 3,
					column: 20
				},
				next: {
					line: 3,
					column: 21
				}
			}
		});

		expect(Meta.calculate(precedingMeta, source + '\r\n')).toEqual({
			range: {
				start: 13,
				end: 46
			},
			location: {
				start: {
					line: 2,
					column: 1
				},
				end: {
					line: 3,
					column: 22
				},
				next: {
					line: 4,
					column: 1
				}
			}
		});
	});

	test('Meta.verify', () => {
		const validMeta = Meta.calculate(Meta.create('Hello World\n'), 'How are you?\n');

		// Checking varName and valid Meta
		expect(() => Meta.verify(validMeta, null)).toThrow(new TypeError('Expected varName to be a String'));
		expect(() => Meta.verify(validMeta)).not.toThrow();
		expect(() => Meta.verify(null)).toThrow(new TypeError('Expected meta to be an Object'));

		// Verify the Range Object
		expect(() => Meta.verify({})).toThrow(new TypeError('Expected meta.range to be an Object'));
		expect(() => Meta.verify({ range: {} })).toThrow(new TypeError('Expected meta.range.start to be an Integer'));
		expect(() => Meta.verify({ range: { start: validMeta.range.start } })).toThrow(new TypeError('Expected meta.range.end to be an Integer'));
		expect(() => Meta.verify({ range: { start: -1, end: -1 } })).toThrow(new RangeError(`Expected meta.range.start to be greater than or equal to 0`));
		expect(() => Meta.verify({ range: { start: 0, end: -1 } })).toThrow(new RangeError(`Expected meta.range.end to be greater than or equal to 1`));
		expect(() => Meta.verify({ range: { start: 2, end: 1 } })).toThrow(new RangeError(`Expected meta.range.end to be greater than meta.range.start`));

		// Verify the Location Object
		expect(() => Meta.verify({ range: validMeta.range })).toThrow(new TypeError('Expected meta.location to be an Object'));

		// Verify the Location Start Object
		expect(() => Meta.verify({ range: validMeta.range, location: {} })).toThrow(new TypeError('Expected meta.location.start to be an Object'));
		expect(() => Meta.verify({ range: validMeta.range, location: { start: {} } })).toThrow(new TypeError('Expected meta.location.start.line to be an Integer'));
		expect(() => Meta.verify({ range: validMeta.range, location: { start: { line: validMeta.location.start.line } } })).toThrow(new TypeError('Expected meta.location.start.column to be an Integer'));
		expect(() => Meta.verify({ range: validMeta.range, location: { start: { line: 0, column: 0 } } })).toThrow(new RangeError(`Expected meta.location.start.line to be greater than or equal to 1`));
		expect(() => Meta.verify({ range: validMeta.range, location: { start: { line: 1, column: 0 } } })).toThrow(new RangeError(`Expected meta.location.start.column to be greater than or equal to 1`));

		// Verify the Location End Object
		expect(() => Meta.verify({ range: validMeta.range, location: { start: validMeta.location.start } })).toThrow(new TypeError('Expected meta.location.end to be an Object'));
		expect(() => Meta.verify({ range: validMeta.range, location: { start: validMeta.location.start, end: {} } })).toThrow(new TypeError('Expected meta.location.end.line to be an Integer'));
		expect(() => Meta.verify({ range: validMeta.range, location: { start: validMeta.location.start, end: { line: validMeta.location.end.line } } })).toThrow(new TypeError('Expected meta.location.end.column to be an Integer'));
		expect(() => Meta.verify({ range: validMeta.range, location: { start: validMeta.location.start, end: { line: 0, column: 0 } } })).toThrow(new RangeError(`Expected meta.location.end.line to be greater than or equal to 1`));
		expect(() => Meta.verify({ range: validMeta.range, location: { start: validMeta.location.start, end: { line: 1, column: 0 } } })).toThrow(new RangeError(`Expected meta.location.end.column to be greater than or equal to 1`));

		// Verify the Location Next Object
		expect(() => Meta.verify({ range: validMeta.range, location: { start: validMeta.location.start, end: validMeta.location.end } })).toThrow(new TypeError('Expected meta.location.next to be an Object'));
		expect(() => Meta.verify({ range: validMeta.range, location: { start: validMeta.location.start, end: validMeta.location.end, next: {} } })).toThrow(new TypeError('Expected meta.location.next.line to be an Integer'));
		expect(() => Meta.verify({ range: validMeta.range, location: { start: validMeta.location.start, end: validMeta.location.end, next: { line: validMeta.location.next.line } } })).toThrow(new TypeError('Expected meta.location.next.column to be an Integer'));
		expect(() => Meta.verify({ range: validMeta.range, location: { start: validMeta.location.start, end: validMeta.location.end, next: { line: 0, column: 0 } } })).toThrow(new RangeError(`Expected meta.location.next.line to be greater than or equal to 1`));
		expect(() => Meta.verify({ range: validMeta.range, location: { start: validMeta.location.start, end: validMeta.location.end, next: { line: 1, column: 0 } } })).toThrow(new RangeError(`Expected meta.location.next.column to be greater than or equal to 1`));

		// Verify Constraints between Location Objects
		expect(() => Meta.verify({ range: validMeta.range, location: { start: { line: 2, column: 1 }, end: { line: 1, column: 1 }, next: { line: 2, column: 1 } } })).toThrow(new RangeError(`Expected meta.location.start.line to be less than or equal to meta.location.end.line`));
		expect(() => Meta.verify({ range: validMeta.range, location: { start: { line: 1, column: 2 }, end: { line: 1, column: 1 }, next: { line: 2, column: 1 } } })).toThrow(new RangeError(`Expected meta.location.start.column to be less than or equal to meta.location.end.column`));
		expect(() => Meta.verify({ range: validMeta.range, location: { start: { line: 1, column: 1 }, end: { line: 2, column: 1 }, next: { line: 1, column: 1 } } })).toThrow(new RangeError(`Expected meta.location.end.line to be less than or equal to meta.location.next.line`));
		expect(() => Meta.verify({ range: validMeta.range, location: { start: { line: 1, column: 1 }, end: { line: 1, column: 2 }, next: { line: 1, column: 1 } } })).toThrow(new RangeError(`Expected meta.location.end.column to be less than or equal to meta.location.next.column`));
	});

	test('Meta.check', () => {
		const validMeta = Meta.calculate(Meta.create('Hello World\n'), 'How are you?\n');

		expect(Meta.check(validMeta)).toEqual(true);
		expect(Meta.check(null)).toEqual(false);
	});
});  