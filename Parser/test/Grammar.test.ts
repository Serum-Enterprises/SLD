import { Grammar } from '../src/Grammar';

describe('Testing Grammar', () => {
	test('Testing Grammar.fromJSON', () => {
		expect(Grammar.fromJSON({
			welcome: [
				{
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
				},
				{
					components: [
						{
							components: [
								{
									type: 'STRING',
									value: 'Hallo Welt',
									name: 'text'
								}
							],
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