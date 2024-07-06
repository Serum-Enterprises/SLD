const { CustomError } = require('../../src/errors/CustomError');

describe('Testing CustomError', () => {
	test('Testing constructor', () => {
		expect(() => new CustomError()).toThrow(new TypeError('Expected message to be a String'));
		expect(() => new CustomError('Hello')).toThrow(new TypeError('Expected index to be an Integer'));
		expect(() => new CustomError('Hello', 1.5)).toThrow(new TypeError('Expected index to be an Integer'));
		expect(() => new CustomError('Hello', -1)).toThrow(new RangeError('Expected index to be greater than or equal to 0'));

		expect(new CustomError('Hello', 0)).toBeInstanceOf(Error);
		expect(new CustomError('Hello', 0)).toBeInstanceOf(CustomError);
	});

	test('Testing get index', () => {
		expect((new CustomError('Hello', 0)).index).toBe(0);
	});

	test('Testing toString', () => {
		expect((new CustomError('Hello', 0)).toString()).toBe('[CustomError] Hello at index 0');
	});
});