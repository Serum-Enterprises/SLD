const Util = require('./Util');

describe('Testing Util', () => {
	test('Util.isJSON', () => {
		const validJSON = {
			"null_value": null,
			"boolean": true,
			"integer": 42,
			"float": 3.14,
			"string": "Hello, world!",
			"array": [1, 2, 3, "four", false],
			"object": {
				"key": "value",
				"nested_object": {
					"inner_key": "inner_value"
				}
			}
		};

		expect(Util.isJSON(validJSON)).toBe(true);
		expect(Util.isJSON(123n)).toBe(false);
	});

	test('Util.cloneJSON', () => {
		const original = {
			"name": "John",
			"age": 30,
			"address": {
				"street": "123 Main St",
				"city": "Anytown",
				"state": "CA",
				"zip": "12345"
			},
			"hobbies": ["reading", "painting", "running"]
		};
		const clone = Util.cloneJSON(original);

		expect(clone).toEqual(original);
		expect(clone).not.toBe(original);
		expect(clone.address).not.toBe(original.address);
		expect(clone.hobbies).not.toBe(original.hobbies);

		expect(Util.cloneJSON(null)).toBeNull();
		expect(() => Util.cloneJSON(123n)).toThrow(new TypeError(`Expected value to be valid JSON`));
	});
});