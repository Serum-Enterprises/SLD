const { BaseSymbol } = require('../BaseSymbol');

describe('Testing BaseSymbol', () => {
	const jsonData = {
		type: 'STRING',
		value: 'Hello World',
		name: 'test'
	};

	test('Testing static fromJSON', () => {
		expect(() => BaseSymbol.fromJSON(null, null)).toThrow(new TypeError('Expected name to be a String'));
		expect(() => BaseSymbol.fromJSON(null)).toThrow(new TypeError('Expected data to be an Object'));
		expect(() => BaseSymbol.fromJSON({})).toThrow(new TypeError('Expected data.type to be a String'));
		expect(() => BaseSymbol.fromJSON({ type: 'TEST' })).toThrow(new RangeError(`Expected data.type to be one of "STRING", "REGEXP", "VARIANT"`));
		expect(() => BaseSymbol.fromJSON({ type: 'STRING' })).toThrow(new TypeError('Expected data.value to be a String'));
		expect(() => BaseSymbol.fromJSON({ type: 'STRING', value: 'Hello World' })).toThrow(new TypeError('Expected data.name to be a String or null'));

		expect(BaseSymbol.fromJSON(jsonData)).toBeInstanceOf(BaseSymbol);
	});

	test('Testing constructor', () => {
		expect(() => new BaseSymbol(null, null, 123)).toThrow(new TypeError('Expected type to be a String'));
		expect(() => new BaseSymbol('TEST', null, 123)).toThrow(new RangeError('Expected type to be one of "STRING", "REGEXP", "VARIANT"'));
		expect(() => new BaseSymbol('STRING', null, 123)).toThrow(new TypeError('Expected value to be a String'));
		expect(() => new BaseSymbol('STRING', 'Hello World', 123)).toThrow(new TypeError('Expected name to be a String or null'));

		expect(new BaseSymbol('STRING', 'Hello World')).toBeInstanceOf(BaseSymbol);
		expect(new BaseSymbol('STRING', 'Hello World', null)).toBeInstanceOf(BaseSymbol);
		expect(new BaseSymbol('STRING', 'Hello World', 'test')).toBeInstanceOf(BaseSymbol);
	});

	test('Testing get type', () => {
		expect((new BaseSymbol('STRING', 'Hello World', 'test')).type).toBe('STRING');
	});

	test('Testing set type', () => {
		const baseSymbol = new BaseSymbol('STRING', 'Hello World', 'test');

		expect(() => baseSymbol.type = null).toThrow(new TypeError('Expected type to be a String'));
		expect(() => baseSymbol.type = 'TEST').toThrow(new RangeError('Expected type to be one of "STRING", "REGEXP", "VARIANT"'));

		baseSymbol.type = 'STRING';
		expect(baseSymbol.type).toBe('STRING');
	});

	test('Testing get value', () => {
		expect((new BaseSymbol('STRING', 'Hello World', 'test')).value).toBe('Hello World');
	});

	test('Testing set value', () => {
		const baseSymbol = new BaseSymbol('STRING', 'Hello World', 'test');

		expect(() => baseSymbol.value = null).toThrow(new TypeError('Expected value to be a String'));

		baseSymbol.value = 'Hello World!';
		expect(baseSymbol.value).toBe('Hello World!');
	});

	test('Testing get name', () => {
		expect((new BaseSymbol('STRING', 'Hello World', 'test')).name).toBe('test');
	});

	test('Testing set name', () => {
		const baseSymbol = new BaseSymbol('STRING', 'Hello World', 'test');

		expect(() => baseSymbol.name = 123).toThrow(new TypeError('Expected name to be a String or null'));

		baseSymbol.name = null;
		expect(baseSymbol.name).toBe(null);
	});

	test('Testing toJSON', () => {
		const baseSymbol = BaseSymbol.fromJSON(jsonData);

		expect(baseSymbol.toJSON()).toEqual(jsonData);
	});
});