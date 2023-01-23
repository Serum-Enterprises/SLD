const Location = require('../lib/Location.class');
const Position = require('../lib/Position.class');

/**
 * Methods:
 * - static createLocation(string)
 * - constructor(start, end)
 * - get start()
 * - get end()
 * - calculateLocation(string)
 * - clone()
 * - toString()
 * - toJSON()
 */

describe('Location', () => {
	test('Testing static createLocation()', () => {
		const location = Location.createLocation('test');

		expect(location.start.line).toBe(1);
		expect(location.start.column).toBe(1);

		expect(location.end.line).toBe(1);
		expect(location.end.column).toBe(4);

		expect(() => Location.createLocation(123)).toThrow(TypeError);
	});

	test('Testing Constructor', () => {
		const location = new Location(new Position(1, 1), new Position(1, 4));

		expect(location.start.line).toBe(1);
		expect(location.start.column).toBe(1);

		expect(location.end.line).toBe(1);
		expect(location.end.column).toBe(4);

		expect(() => new Location(new Position(1, 1), 123)).toThrow(TypeError);
		expect(() => new Location(123, new Position(1, 1))).toThrow(TypeError);
	});

	test('Testing calculateLocation()', () => {
		const location = new Location(new Position(1, 1), new Position(1, 4));

		const newLocation = location.calculateLocation('\ntest');

		expect(newLocation.start.line).toBe(1);
		expect(newLocation.start.column).toBe(5);

		expect(newLocation.end.line).toBe(2);
		expect(newLocation.end.column).toBe(4);

		expect(() => location.calculateLocation(123)).toThrow(TypeError);
	});

	test('Testing clone()', () => {
		const location = new Location(new Position(1, 1), new Position(1, 4));
		const clone = location.clone();

		expect(clone.start.line).toBe(location.start.line);
		expect(clone.start.column).toBe(location.start.column);

		expect(clone.end.line).toBe(location.end.line);
		expect(clone.end.column).toBe(location.end.column);

		expect(clone).not.toBe(location);
	});

	test('Testing toJSON()', () => {
		const location = new Location(new Position(1, 1), new Position(1, 4));
		const json = location.toJSON();

		expect(json).toEqual({ start: { line: 1, column: 1 }, end: { line: 1, column: 4 } });
	});

	test('Testing toString()', () => {
		const location = new Location(new Position(1, 1), new Position(1, 4));

		expect(location.toString()).toEqual('{"start":{"line":1,"column":1},"end":{"line":1,"column":4}}');
	});
});