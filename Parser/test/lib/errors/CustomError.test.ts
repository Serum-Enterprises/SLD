import { CustomError } from '../../../lib/errors/CustomError'

describe('Testing CustomError', () => {
	test('Testing Constructor', () => {
		expect(() => new CustomError('Test Error Message', -1)).toThrow(new RangeError('Expected index to be greater than or equal to 0'));

		expect(new CustomError('Test Error Message', 0)).toBeInstanceOf(CustomError);
	});

	test('Testing get index', () => {
		const error = new CustomError('Test Error Message', 0);

		expect(error.index).toBe(0);
	});

	test('Testing toString', () => {
		const error = new CustomError('Test Error Message', 0);

		expect(error.toString()).toBe('Test Error Message at index 0');
	})
});