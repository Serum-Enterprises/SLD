const Location = require('../src/Location.class');
const Position = require('../src/Position.class');
const Range = require('../src/Range.class');
const Meta = require('../src/Meta.class');

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
		const json = JSON.parse(JSON.stringify(location.toJSON()));

		expect(json).toEqual({ start: { line: 1, column: 1 }, end: { line: 1, column: 4 } });
	});

	test('Testing toString()', () => {
		const location = new Location(new Position(1, 1), new Position(1, 4));

		expect(location.toString()).toEqual('{"start":{"line":1,"column":1},"end":{"line":1,"column":4}}');
	});
});

describe('Meta', () => {
	test('Testing static createMeta()', () => {
		const meta = Meta.createMeta('test');

		expect(meta.range).toBeInstanceOf(Range);
		expect(meta.location).toBeInstanceOf(Location);
		expect(meta.location.start).toBeInstanceOf(Position);
		expect(meta.location.end).toBeInstanceOf(Position);

		expect(meta.range.start).toBe(0);
		expect(meta.range.end).toBe(3);

		expect(meta.location.start.line).toBe(1);
		expect(meta.location.start.column).toBe(1);

		expect(meta.location.end.line).toBe(1);
		expect(meta.location.end.column).toBe(4);

		expect(() => Meta.createMeta(123)).toThrow(TypeError);
	});

	test('Testing Constructor', () => {
		const range = new Range(0, 3);
		const location = new Location(new Position(1, 1), new Position(1, 4));
		const meta = new Meta(range, location);

		expect(meta.range).toBeInstanceOf(Range);
		expect(meta.location).toBeInstanceOf(Location);

		expect(() => new Meta(123, location)).toThrow(TypeError);
		expect(() => new Meta(range, 123)).toThrow(TypeError);
	});

	test('Testing calculateMeta', () => {
		const range = new Range(0, 3);
		const location = new Location(new Position(1, 1), new Position(1, 4));
		const meta = new Meta(range, location);

		const newMeta = meta.calculateMeta('\ntest');

		expect(newMeta.range).toBeInstanceOf(Range);
		expect(newMeta.location).toBeInstanceOf(Location);

		expect(newMeta.range.start).toBe(4);
		expect(newMeta.range.end).toBe(8);

		expect(newMeta.location.start.line).toBe(1);
		expect(newMeta.location.start.column).toBe(5);

		expect(newMeta.location.end.line).toBe(2);
		expect(newMeta.location.end.column).toBe(4);

		expect(() => meta.calculateMeta(123)).toThrow(TypeError);
	});
	
	test('Testing clone()', () => {
		const range = new Range(0, 3);
		const location = new Location(new Position(1, 1), new Position(1, 4));
		const meta = new Meta(range, location);
		const clone = meta.clone();

		expect(clone.range).toBeInstanceOf(Range);
		expect(clone.location).toBeInstanceOf(Location);

		expect(clone.range.start).toBe(meta.range.start);
		expect(clone.range.end).toBe(meta.range.end);

		expect(clone.location.start.line).toBe(meta.location.start.line);
		expect(clone.location.start.column).toBe(meta.location.start.column);

		expect(clone.location.end.line).toBe(meta.location.end.line);
		expect(clone.location.end.column).toBe(meta.location.end.column);

		expect(clone).not.toBe(meta);
	});

	test('Testing toJSON()', () => {
		const range = new Range(0, 3);
		const location = new Location(new Position(1, 1), new Position(1, 4));
		const meta = new Meta(range, location);
		const json = meta.toJSON()

		expect(json.location).toBe(location);
		expect(json.range).toBe(range);
	});

	test('Testing toString()', () => {
		const range = new Range(0, 3);
		const location = new Location(new Position(1, 1), new Position(1, 4));
		const meta = new Meta(range, location);

		expect(meta.toString()).toEqual('{"range":{"start":0,"end":3},"location":{"start":{"line":1,"column":1},"end":{"line":1,"column":4}}}');
	});
})