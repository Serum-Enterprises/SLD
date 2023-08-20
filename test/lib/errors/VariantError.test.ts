import { VariantError } from '../../../src/lib/errors/VariantError'

describe('Testing CustomThrowError', () => {
	test('Testing Constructor', () => {
		expect(() => new VariantError('Test Error Message', -1)).toThrow(new RangeError('Expected index to be greater than or equal to 0'));

		expect(new VariantError('Test Error Message', 0)).toBeInstanceOf(VariantError);
	});

	test('Testing get index', () => {
		const error = new VariantError('Test Error Message', 0);

		expect(error.index).toBe(0);
	});

	test('Testing toString', () => {
		const error = new VariantError('Test Error Message', 0);

		expect(error.toString()).toBe('Test Error Message at index 0');
	})
});