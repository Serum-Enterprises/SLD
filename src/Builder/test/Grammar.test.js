const { Grammar } = require('../src/Grammar');

describe('Testing Grammar', () => {
	test('Testing static create', () => {
		expect(Grammar.create()).toBeInstanceOf(Grammar);
	});
})