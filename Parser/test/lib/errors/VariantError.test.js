const { VariantError } = require('../../../lib/errors/VariantError');

describe('Testing VariantError', () => {
	test('Testing constructor', () => {
		expect(() => new VariantError()).toThrow(new TypeError('Expected message to be a String'));
		expect(() => new VariantError('Hello')).toThrow(new TypeError('Expected index to be an Integer'));
		expect(() => new VariantError('Hello', 1.5)).toThrow(new TypeError('Expected index to be an Integer'));
		expect(() => new VariantError('Hello', -1)).toThrow(new RangeError('Expected index to be greater than or equal to 0'));

		expect(new VariantError('Hello', 0)).toBeInstanceOf(Error);
		expect(new VariantError('Hello', 0)).toBeInstanceOf(VariantError);
	});

	test('Testing get index', () => {
		expect((new VariantError('Hello', 0)).index).toBe(0);
	});

	test('Testing toString', () => {
		expect((new VariantError('Hello', 0)).toString()).toBe('[VariantError] Hello at index 0');
	});
});