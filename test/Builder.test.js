const { Grammar, Variant, Rule } = require('../src/Builder.js');

describe('Testing Grammar', () => {
	test('Testing static create', () => {
		expect(Grammar.create()).toBeInstanceOf(Grammar);
		expect(Grammar.create({})).toBeInstanceOf(Grammar);
	});

	test('Testing constructor', () => {
		expect(() => new Grammar(null)).toThrow(new TypeError('Expected variants to be an Object'));
		expect(() => new Grammar({ test: null })).toThrow(new TypeError('Expected variants.test to be an instance of Variant'));

		expect(new Grammar()).toBeInstanceOf(Grammar);
	});

	test('Testing set', () => {
		const grammar = new Grammar();

		expect(() => grammar.set(null)).toThrow(new TypeError('Expected key to be a String'));
		expect(() => grammar.set('test', null)).toThrow(new TypeError('Expected value to be an instance of Variant'));

		expect(grammar.set('test', new Variant())).toBeInstanceOf(Grammar);
		expect(grammar.set('test', new Variant()).get('test')).toBeInstanceOf(Variant);
	});

	test('Testing toJSON', () => {
		expect(() => new Grammar().toJSON()).not.toThrow();
	});
});

describe('Testing Variant', () => {
	test('Testing static create', () => {
		expect(Variant.create()).toBeInstanceOf(Variant);
		expect(Variant.create([])).toBeInstanceOf(Variant);
	});

	test('Testing constructor', () => {
		expect(() => new Variant(null)).toThrow(new TypeError('Expected rules to be an Array'));
		expect(() => new Variant([null])).toThrow(new TypeError('Expected rules[0] to be an instance of Rule'));

		expect(new Variant()).toBeInstanceOf(Variant);
	});

	test('Testing add', () => {
		expect(() => new Variant().add(null)).toThrow(new TypeError('Expected value to be an instance of Rule'));
		expect(new Variant().add(new Rule())).toBeInstanceOf(Variant);
	})

	test('Testing toJSON', () => {
		expect(() => new Variant().toJSON()).not.toThrow();
	});
});

describe('Rule', () => {
	test('Testing static get match', () => {
		expect(Rule.match).toBeInstanceOf(Rule);
	});

	test('Testing constructor', () => {
		expect(() => new Rule(null)).toThrow(new TypeError('Expected rule to be a String'));
		expect(() => new Rule('test', null)).toThrow(new TypeError('Expected weight to be a Number'));

		expect(new Rule()).toBeInstanceOf(Rule);
	});

	test('Testing toJSON', () => {
		expect(() => new Rule().toJSON()).not.toThrow();
	});
});


Array.prototype.divide = function (f) {
	const trueGroup = [];
	const falseGroup = [];

	this.forEach(i => {
		if (f(i))
			trueGroup.push(i)
		else
			falseGroup.push(i)
	});

	return [trueGroup, falseGroup];
}