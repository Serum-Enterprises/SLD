import { CustomThrowError } from '../../../src/lib/errors/CustomThrowError'

describe('Testing CustomThrowError', () => {
	test('Testing Constructor', () => {
		expect(() => new CustomThrowError('Test Error Message', -1)).toThrow(new RangeError('Expected index to be greater than or equal to 0'));

		expect(new CustomThrowError('Test Error Message', 0)).toBeInstanceOf(CustomThrowError);
	});

	test('Testing get index', () => {
		const error = new CustomThrowError('Test Error Message', 0);

		expect(error.index).toBe(0);
	});

	test('Testing toString', () => {
		const error = new CustomThrowError('Test Error Message', 0);

		expect(error.toString()).toBe('Test Error Message at index 0');
	})
});