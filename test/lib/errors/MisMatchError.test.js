const MisMatchError = require('../../../src/lib/errors/AutoThrowError');

describe('Testing MisMatchError', () => {
	test('Testing Constructor', () => {
		expect(() => new MisMatchError(0)).toThrow(new TypeError('Expected message to be a String'))
		expect(() => new MisMatchError('Test error message', 0.5)).toThrow(new TypeError('Expected index to be an Integer'))
		expect(() => new MisMatchError('Test error message', -1)).toThrow(new RangeError('Expected index to be greater than or equal to 0'))

		expect(new MisMatchError('Test error message', 0)).toBeInstanceOf(MisMatchError);
	});

	test('Testing Getter index', () => {
		const errorIndex = 10;
		const error = new MisMatchError('Test error message', errorIndex);

		expect(error.index).toBe(errorIndex);
	});

	test('Testing toString', () => {
		const errorMessage = 'Test error message';
		const errorIndex = 10;
		const error = new MisMatchError(errorMessage, errorIndex);

		expect(error.toString()).toBe(`${errorMessage} at index ${errorIndex}`);
	});
});
