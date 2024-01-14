const { Rule } = require('../Rule');
const { Grammar } = require('../Grammar');

describe('Testing Grammar', () => {
	const jsonData = {
		greeting: [
			{
				symbolSets: [
					{
						symbols: [
							{
								type: 'STRING',
								value: 'Hello World',
								name: null
							}
						],
						optional: false,
						greedy: false
					},
					{
						symbols: [
							{
								type: 'STRING',
								value: '!',
								name: null
							}
						],
						optional: true,
						greedy: false
					}
				],
				throwMessage: null,
				recoverSymbol: {
					type: 'STRING',
					value: '!',
					name: null
				}
			},
			{
				symbolSets: [
					{
						symbols: [
							{
								type: 'STRING',
								value: 'Hallo Welt',
								name: null
							}
						],
						optional: false,
						greedy: false
					},
					{
						symbols: [
							{
								type: 'STRING',
								value: '!',
								name: null
							}
						],
						optional: true,
						greedy: false
					}
				],
				throwMessage: null,
				recoverSymbol: {
					type: 'STRING',
					value: '!',
					name: null
				}
			}
		],
		catchAll: [
			{
				symbolSets: [],
				throwMessage: 'Could not find any Greeting',
				recoverSymbol: null
			}
		]
	};

	test('Testing static fromJSON', () => {
		expect(() => Grammar.fromJSON(null, null)).toThrow(new TypeError('Expected name to be a String'));
		expect(() => Grammar.fromJSON(null)).toThrow(new TypeError('Expected data to be an Object'));
		expect(() => Grammar.fromJSON({ rule1: null })).toThrow(new TypeError('Expected data.rule1 to be an Array'));

		expect(Grammar.fromJSON(jsonData)).toBeInstanceOf(Grammar);
	});

	test('Testing constructor', () => {
		expect(() => new Grammar(null)).toThrow(new TypeError('Expected rules to be an Object'));
		expect(() => new Grammar({ rule1: null })).toThrow(new TypeError('Expected rules.rule1 to be an Array'));
		expect(() => new Grammar({ rule1: ['Hello World'] })).toThrow(new TypeError('Expected rules.rule1[0] to be an instance of Rule'));

		expect(new Grammar({})).toBeInstanceOf(Grammar);
		expect(new Grammar({ rule1: [] })).toBeInstanceOf(Grammar);
		expect(new Grammar({ rule1: [new Rule([])] })).toBeInstanceOf(Grammar);
	});

	test('Testing get rules', () => {
		const rule1 = new Rule([]);
		const rule2 = new Rule([]);

		expect((new Grammar({})).rules).toEqual({});
		expect((new Grammar({ rule1: [rule1] })).rules).toEqual({ rule1: [rule1] });
		expect((new Grammar({ rule1: [rule1], rule2: [rule2] })).rules).toEqual({ rule1: [rule1], rule2: [rule2] });
	});

	test('Testing toJSON', () => {
		const grammar = Grammar.fromJSON(jsonData);

		expect(grammar.toJSON()).toEqual(jsonData);
	});
});