import * as SLD from '../src/index';

const multiLangRuleVariant: SLD.Variant = SLD.Variant.create([
	// English
	SLD.Rule.begin('Hello', 'firstWord')
		.followedBy('World', 'secondWord'),
	// German
	SLD.Rule.begin('Hallo', 'firstWord')
		.followedBy('Welt', 'secondWord'),

	// Mixup Throw
	SLD.Rule.begin('Hello', 'firstWord')
		.followedBy('Welt', 'secondWord')
		.throw('Mixup of languages'),
	SLD.Rule.begin('Hallo', 'firstWord')
		.followedBy('World', 'secondWord')
		.throw('Mixup of languages'),

	// Global Throw
	SLD.Rule.throw('Invalid Input'),
]);

const input = {
	GERMAN: 'Hallo Welt',
	ENGLISH: 'Hello World',
	MIXUP: 'Hello Welt',
	INVALID: 'Hola Mundo'
};

const output = {
	GERMAN: SLD.Parser.create(multiLangRuleVariant).parse(input.GERMAN),
	ENGLISH: SLD.Parser.create(multiLangRuleVariant).parse(input.ENGLISH),
	MIXUP: SLD.Parser.create(multiLangRuleVariant).parse(input.MIXUP),
	INVALID: SLD.Parser.create(multiLangRuleVariant).parse(input.INVALID)
};

console.log(JSON.stringify(output, null, 2));