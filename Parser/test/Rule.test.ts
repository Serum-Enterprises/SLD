import { Rule } from '../src/Rule';

describe('Testing Rule', () => {
	test('Testing Rule.fromJSON', () => {
		expect(Rule.fromJSON({
			components: [
				{
					components: [
						{
							type: 'STRING',
							value: 'Hello World',
							name: 'text'
						}
					],
					greedy: false,
					optional: false
				}
			],
			throwMessage: null,
			recoverComponent: null
		})).toBeInstanceOf(Rule);
	});
});