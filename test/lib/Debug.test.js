const Debug = require('../../src/lib/Debug');

describe('Testing Debug', () => {
	test('Testing static formatDiff()', () => {
		expect(() => Debug.formatDiff(123)).toThrow(new TypeError('Expected diff to be a BigInt'));

		expect(Debug.formatDiff(31536000000000000n)).toBe('~1 y');
		expect(Debug.formatDiff(86400000000000n)).toBe('~1 d');
		expect(Debug.formatDiff(60000000000n)).toBe('~1 m');
		expect(Debug.formatDiff(1000000000n)).toBe('~1 s');
		expect(Debug.formatDiff(1000000n)).toBe('~1 ms');
		expect(Debug.formatDiff(1000n)).toBe('~1 µs');
		expect(Debug.formatDiff(500n)).toBe(' 500 ns');
	});

	test('Testing static create', () => {
		expect(() => Debug.create(123)).toThrow(new TypeError('Expected namespace to be a String'));
		expect(() => Debug.create('namespace', 'invalid')).toThrow(new TypeError('Expected stream to be a Boolean'));

		expect(Debug.create('namespace', true)).toBeInstanceOf(Debug);
	});

	test('Testing constructor', () => {
		expect(() => new Debug(123)).toThrow(new TypeError('Expected namespace to be a String'));
		expect(() => new Debug('namespace', 'invalid')).toThrow(new TypeError('Expected stream to be a Boolean'));
		expect(() => new Debug('namespace', true, 'invalid')).toThrow(new TypeError('Expected dataID to be a Symbol'));

		expect(new Debug('namespace')).toBeInstanceOf(Debug);
	});

	test('extend', () => {
		expect(() => new Debug('namespace').extend(123)).toThrow(new TypeError('Expected namespace to be a String'));

		const debug = new Debug('namespace').extend('extended');

		expect(debug).toBeInstanceOf(Debug);
	});

	test('Testing log', () => {
		expect(() => new Debug('namespace', true).log(123)).toThrow(new TypeError('Expected message to be a String'));

		const debug = new Debug('namespace', true);

		const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

		debug.log('Test log message');

		expect(logSpy).toHaveBeenCalledTimes(1);

		logSpy.mockReset();
	});

	test('warn', () => {
		expect(() => new Debug('namespace', true).warn(123)).toThrow(new TypeError('Expected message to be a String'));

		const debug = new Debug('namespace', true);

		const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

		debug.warn('Test warn message');

		expect(warnSpy).toHaveBeenCalledTimes(1);

		warnSpy.mockReset();
	});

	test('error', () => {
		expect(() => new Debug('namespace', true).error(123)).toThrow(new TypeError('Expected message to be a String'));

		const debug = new Debug('namespace', true);

		const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

		debug.error('Test error message');

		expect(errorSpy).toHaveBeenCalledTimes(1);

		errorSpy.mockReset();
	});

	test('print', () => {
		const debugStream = new Debug('namespace', true);
		const debugTable = new Debug('namespace', false);

		const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
		const tableSpy = jest.spyOn(console, 'table').mockImplementation(() => {});

		debugStream.print();

		expect(warnSpy).toHaveBeenCalledTimes(1);
		expect(warnSpy).toHaveBeenCalledWith('[namespace] Debug.print() is not supported in stream mode');

		debugTable.log('Test log message');

		debugTable.print();
		
		expect(tableSpy).toHaveBeenCalledTimes(1);
	});
});
