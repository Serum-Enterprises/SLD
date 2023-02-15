const Position = require('../src/Position.class');

describe('Position', () => {
	test('Testing Constructor', () => {
		const position = new Position(3, 2);
		expect(position.line).toBe(3);
		expect(position.column).toBe(2);

		expect(() => new Position(0, 2)).toThrow(TypeError);
		expect(() => new Position(-1, 2)).toThrow(TypeError);
		expect(() => new Position(3.5, 2)).toThrow(TypeError);

		expect(() => new Position(3, 0)).toThrow(TypeError);
		expect(() => new Position(3, -1)).toThrow(TypeError);
		expect(() => new Position(3, 3.5)).toThrow(TypeError);
	});

	test('Testing clone()', () => {
		const position = new Position(3, 2);
		const clone = position.clone();

		expect(clone.line).toBe(position.line);
		expect(clone.column).toBe(position.column);
		expect(clone).not.toBe(position);
	});
	
	test('Testing toJSON()', () => {
		const position = new Position(3, 2);
		const json = position.toJSON();

		expect(json).toEqual({ line: 3, column: 2 });
	});

	test('Testing toString()', () => {
		const position = new Position(3, 2);

		expect(position.toString()).toEqual('{"line":3,"column":2}');
	});
});
