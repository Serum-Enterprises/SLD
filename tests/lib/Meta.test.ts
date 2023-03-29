import * as Meta from '../../src/lib/Meta';

describe('Testing Meta', () => {
	test('Testing Meta.create', () => {
		expect(Meta.create('Hello\nWorld')).toEqual<Meta.Meta>({
			range: {
				start: 0,
				end: 10
			},
			location: {
				start: {
					line: 1,
					column: 1
				},
				end: {
					line: 2,
					column: 5
				},
				next: {
					line: 2,
					column: 6
				},
			}
		});

		expect(Meta.create('Hello\r\n\nWorld\n')).toEqual<Meta.Meta>({
			range: {
				start: 0,
				end: 13
			},
			location: {
				start: {
					line: 1,
					column: 1
				},
				end: {
					line: 3,
					column: 5
				},
				next: {
					line: 4,
					column: 1
				},
			}
		});

		expect(() => Meta.create('')).toThrow(new RangeError('Expected source to be a non-empty String'));
	});

	test('Testing Meta.calculate', () => {
		const precedingMeta = Meta.create('Hello\n');

		expect(Meta.calculate(precedingMeta, 'World'))
			.toEqual<Meta.Meta>({
				range: {
					start: 6,
					end: 10
				},
				location: {
					start: {
						line: 2,
						column: 1
					},
					end: {
						line: 2,
						column: 5
					},
					next: {
						line: 2,
						column: 6
					},
				}
			});

		expect(Meta.calculate(precedingMeta, 'World\r\nTest\r\n'))
			.toEqual<Meta.Meta>({
				range: {
					start: 6,
					end: 18
				},
				location: {
					start: {
						line: 2,
						column: 1
					},
					end: {
						line: 3,
						column: 6
					},
					next: {
						line: 4,
						column: 1
					},
				}
			});

		expect(() => Meta.calculate(precedingMeta, '')).toThrow(new RangeError('Expected source to be a non-empty String'));
	});
});