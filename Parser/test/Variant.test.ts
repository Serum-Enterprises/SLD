import { Variant } from '../../Parser/Variant';

describe('Testing Variant', () => {
	test('Testing Variant.fromJSON', () => {
		expect(Variant.fromJSON([{
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
		}])).toBeInstanceOf(Variant);
	});
});