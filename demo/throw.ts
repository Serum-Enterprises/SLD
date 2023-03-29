import * as SLD from '../src/index';

const multiLangRuleVariant: SLD.Variant = SLD.Variant.create([
	// English
	SLD.Rule.matchOne('Hello', 'firstWord')
		.followedByOne('World', 'secondWord'),
	// German
	SLD.Rule.matchOne('Hallo', 'firstWord')
		.followedByOne('Welt', 'secondWord'),

	// Mixup Throw
	SLD.Rule.matchOne('Hello', 'firstWord')
		.followedByOne('Welt', 'secondWord')
		.throw('Mixup of languages'),
	SLD.Rule.matchOne('Hallo', 'firstWord')
		.followedByOne('World', 'secondWord')
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

export const output = {
	GERMAN: SLD.Parser.create(multiLangRuleVariant).parse(input.GERMAN, true, true),
	ENGLISH: SLD.Parser.create(multiLangRuleVariant).parse(input.ENGLISH, true, true),
	MIXUP: SLD.Parser.create(multiLangRuleVariant).parse(input.MIXUP, true, true),
	INVALID: SLD.Parser.create(multiLangRuleVariant).parse(input.INVALID, true, true)
};