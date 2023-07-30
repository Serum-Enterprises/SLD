const AutoThrowError = require('../../../src/lib/errors/AutoThrowError');

describe('Testing AutoThrowError', () => {
	test('Testing Constructor', () => {
		expect(() => new AutoThrowError(0)).toThrow(new TypeError('Expected message to be a String'))
		expect(() => new AutoThrowError('Test error message', 0.5)).toThrow(new TypeError('Expected index to be an Integer'))
		expect(() => new AutoThrowError('Test error message', -1)).toThrow(new RangeError('Expected index to be greater than or equal to 0'))

		expect(new AutoThrowError('Test error message', 0)).toBeInstanceOf(AutoThrowError);
	});

	test('Testing Getter index', () => {
		const errorIndex = 10;
		const error = new AutoThrowError('Test error message', errorIndex);

		expect(error.index).toBe(errorIndex);
	});

	test('Testing toString', () => {
		const errorMessage = 'Test error message';
		const errorIndex = 10;
		const error = new AutoThrowError(errorMessage, errorIndex);

		expect(error.toString()).toBe(`${errorMessage} at index ${errorIndex}`);
	});
});
