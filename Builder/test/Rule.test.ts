import { ComponentSet, BaseComponent } from '../src/Component';
import { Rule } from '../src/Rule';

describe("Testing Component", () => {
	test('Testing static throw', () => {
		expect(Rule.throw('Test Message')).toBeInstanceOf(Rule);
	});

	test('Testing constructor', () => {
		expect(new Rule([
			ComponentSet.create([BaseComponent.create('STRING', 'Hello')], false, false)
		])).toBeInstanceOf(Rule);
	});

	test('Testing static match, QuantitySelector and ComponentSelector', () => {
		expect(() => Rule.match).not.toThrow();

		expect(Rule.match.one.string('Hello')).toBeInstanceOf(Rule);
		expect(Rule.match.one.regexp(/\s+/)).toBeInstanceOf(Rule);
		expect(Rule.match.one.variant('Hello')).toBeInstanceOf(Rule);
		expect(Rule.match.one.whitespace()).toBeInstanceOf(Rule);
		expect(Rule.match.oneOrMore.string('Hello')).toBeInstanceOf(Rule);
		expect(Rule.match.oneOrMore.regexp(/\s+/)).toBeInstanceOf(Rule);
		expect(Rule.match.oneOrMore.variant('Hello')).toBeInstanceOf(Rule);
		expect(Rule.match.oneOrMore.whitespace()).toBeInstanceOf(Rule);
		expect(Rule.match.zeroOrOne.string('Hello')).toBeInstanceOf(Rule);
		expect(Rule.match.zeroOrOne.regexp(/\s+/)).toBeInstanceOf(Rule);
		expect(Rule.match.zeroOrOne.variant('Hello')).toBeInstanceOf(Rule);
		expect(Rule.match.zeroOrOne.whitespace()).toBeInstanceOf(Rule);
		expect(Rule.match.zeroOrMore.string('Hello')).toBeInstanceOf(Rule);
		expect(Rule.match.zeroOrMore.regexp(/\s+/)).toBeInstanceOf(Rule);
		expect(Rule.match.zeroOrMore.variant('Hello')).toBeInstanceOf(Rule);
		expect(Rule.match.zeroOrMore.whitespace()).toBeInstanceOf(Rule);
	});
	test('Testing addComponent', () => {
		expect(Rule.match.one.string('Hello')
			.addComponentSet(ComponentSet.create([BaseComponent.create('STRING', 'testValue', 'testName')], true, true))).toBeInstanceOf(Rule);
	});

	test('Testing recover', () => {
		expect(Rule.match.one.string('Hello')
			.recover('STRING', '!')).toBeInstanceOf(Rule);
	});

	test('Testing throw', () => {
		expect(Rule.match.one.string('Hello')
			.throw('Test Message')).toBeInstanceOf(Rule);
	});

	test('Testing capture', () => {
		expect(Rule.throw('Test Message')).toBeInstanceOf(Rule);
		expect(Rule.match.one.string('Hello', 'testName')).toBeInstanceOf(Rule);
	});

	test('Testing followedBy', () => {
		expect(
			Rule.match.one.string('Hello')
				.followedBy.one.string('!')
				.toJSON()
		)
			.toStrictEqual({
				components: [
					{
						components: [
							{
								type: 'STRING',
								value: 'Hello',
								name: null
							}
						],
						greedy: false,
						optional: false
					},
					{
						components: [
							{
								type: 'REGEXP',
								value: '^\\s+',
								name: null
							},
							{
								type: 'STRING',
								value: '!',
								name: null
							}
						],
						greedy: false,
						optional: false
					}
				],
				throwMessage: null,
				recoverComponent: null
			});
	});

	test('Testing directlyFollowedBy', () => {
		expect(
			Rule.match.one.string('Hello')
				.directlyFollowedBy.one.string('!')
				.toJSON()
		)
			.toStrictEqual({
				components: [
					{
						components: [
							{
								type: 'STRING',
								value: 'Hello',
								name: null
							}
						],

						greedy: false,
						optional: false
					},
					{
						components: [
							{
								type: 'STRING',
								value: '!',
								name: null
							}
						],
						greedy: false,
						optional: false
					}
				],
				throwMessage: null,
				recoverComponent: null
			});
	});

	test('Testing toJSON', () => {
		expect(
			Rule.match.one.string('Hello')
				.toJSON()
		)
			.toStrictEqual({
				components: [
					{
						components: [
							{
								type: 'STRING',
								value: 'Hello',
								name: null,
							}
						],
						greedy: false,
						optional: false,
					}
				],
				throwMessage: null,
				recoverComponent: null
			});

		expect(
			Rule.match.one.string('Hello')
				.recover('STRING', '!')
				.throw('Test Message')
				.toJSON()
		)
			.toStrictEqual({
				components: [
					{
						components: [
							{
								type: 'STRING',
								value: 'Hello',
								name: null,
							}
						],
						greedy: false,
						optional: false,
					}
				],
				throwMessage: 'Test Message',
				recoverComponent: {
					type: 'STRING',
					value: '!',
					name: null
				}
			});
	});
});