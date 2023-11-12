import { MisMatchError } from '../../../lib/errors/MisMatchError'

describe('Testing CustomThrowError', () => {
	test('Testing Constructor', () => {
		expect(() => new MisMatchError('Test Error Message', -1)).toThrow(new RangeError('Expected index to be greater than or equal to 0'));

		expect(new MisMatchError('Test Error Message', 0)).toBeInstanceOf(MisMatchError);
	});

	test('Testing get index', () => {
		const error = new MisMatchError('Test Error Message', 0);

		expect(error.index).toBe(0);
	});

	test('Testing toString', () => {
		const error = new MisMatchError('Test Error Message', 0);

		expect(error.toString()).toBe('Test Error Message at index 0');
	})
});