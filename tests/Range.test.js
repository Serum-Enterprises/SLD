const Range = require('../lib/Meta/Range.class');

/**
 * Methods:
 * - static createRange(string)
 * - constructor(start, end)
 * - get start()
 * - get end()
 * - calculateRange(string)
 * - clone()
 * - toString()
 * - toJSON()
 */

describe('Range', () => {
    test('Testing static createRange()', () => {
        const range = Range.createRange('test');

        expect(range.start).toBe(0);
        expect(range.end).toBe(3);

        expect(() => Range.createRange(123)).toThrow(TypeError);
    });

    test('Testing Constructor', () => {
        const range = new Range(1, 2);

        expect(range.start).toBe(1);
        expect(range.end).toBe(2);

        expect(() => new Range(-1, 2)).toThrow(TypeError);
        expect(() => new Range(1.5, 2)).toThrow(TypeError);
        expect(() => new Range('a', 2)).toThrow(TypeError);

        expect(() => new Range(1, -2)).toThrow(TypeError);
        expect(() => new Range(1, 2.5)).toThrow(TypeError);
        expect(() => new Range(1, 'b')).toThrow(TypeError);
    });

    test('Testing calculateRange()', () => {
        const range = new Range(1, 2);

        const newRange = range.calculateRange('test');

        expect(newRange.start).toBe(3);
        expect(newRange.end).toBe(6);

        expect(() => range.calculateRange(123)).toThrow(TypeError);
    });

    test('Testing clone()', () => {
        const range = new Range(1, 2);
        const clone = range.clone();

        expect(clone.start).toBe(range.start);
        expect(clone.end).toBe(range.end);
        expect(clone).not.toBe(range);
    });

    test('Testing toJSON()', () => {
        const range = new Range(1, 2);
        const json = range.toJSON();

        expect(json).toEqual({ start: 1, end: 2 });
    });

    test('Testing toString()', () => {
        const range = new Range(1, 2);

        expect(range.toString()).toEqual('{"start":1,"end":2}');
    });
});