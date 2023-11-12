import { Grammar } from '../../Parser/Grammar';

describe('Testing Grammar', () => {
	test('Testing Grammar.fromJSON', () => {
		expect(Grammar.fromJSON({
			welcome: [
				{
					components: [
						{
							type: 'STRING',
							value: 'Hello World',
							name: 'text',
							greedy: false,
							optional: false
						}
					],
					throwMessage: null,
					recoverComponent: null
				},
				{
					components: [
						{
							type: 'STRING',
							value: 'Hallo Welt',
							name: 'text',
							greedy: false,
							optional: false
						}
					],
					throwMessage: null,
					recoverComponent: null
				}
			]
		})).toBeInstanceOf(Grammar);
	});
});