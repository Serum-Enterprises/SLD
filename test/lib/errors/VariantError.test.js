const VariantError = require('../../../src/lib/errors/AutoThrowError');

describe('Testing VariantError', () => {
	test('Testing Constructor', () => {
		expect(() => new VariantError(0)).toThrow(new TypeError('Expected message to be a String'))
		expect(() => new VariantError('Test error message', 0.5)).toThrow(new TypeError('Expected index to be an Integer'))
		expect(() => new VariantError('Test error message', -1)).toThrow(new RangeError('Expected index to be greater than or equal to 0'))

		expect(new VariantError('Test error message', 0)).toBeInstanceOf(VariantError);
	});

	test('Testing Getter index', () => {
		const errorIndex = 10;
		const error = new VariantError('Test error message', errorIndex);

		expect(error.index).toBe(errorIndex);
	});

	test('Testing toString', () => {
		const errorMessage = 'Test error message';
		const errorIndex = 10;
		const error = new VariantError(errorMessage, errorIndex);

		expect(error.toString()).toBe(`${errorMessage} at index ${errorIndex}`);
	});
});
