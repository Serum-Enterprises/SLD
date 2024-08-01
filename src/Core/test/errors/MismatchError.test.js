const { MisMatchError } = require('../../src/errors/MisMatchError');

describe('Testing MisMatchError', () => {
	test('Testing constructor', () => {
		expect(() => new MisMatchError()).toThrow(new TypeError('Expected message to be a String'));
		expect(() => new MisMatchError('Hello')).toThrow(new TypeError('Expected index to be an Integer'));
		expect(() => new MisMatchError('Hello', 1.5)).toThrow(new TypeError('Expected index to be an Integer'));
		expect(() => new MisMatchError('Hello', -1)).toThrow(new RangeError('Expected index to be greater than or equal to 0'));

		expect(new MisMatchError('Hello', 0)).toBeInstanceOf(Error);
		expect(new MisMatchError('Hello', 0)).toBeInstanceOf(MisMatchError);
	});

	test('Testing get index', () => {
		expect((new MisMatchError('Hello', 0)).index).toBe(0);
	});

	test('Testing toString', () => {
		expect((new MisMatchError('Hello', 0)).toString()).toBe('[MisMatchError] Hello at index 0');
	});
});