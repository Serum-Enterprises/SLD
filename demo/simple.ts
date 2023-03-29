import * as SLD from '../src/index';

const multiLangRuleVariant: SLD.Variant = SLD.Variant.create([
	// English
	SLD.Rule.match.one('Hello', 'firstWord')
		.followedBy.one('World', 'secondWord'),
	// German
	SLD.Rule.matchOne('Hallo', 'firstWord')
		.followedByOne('Welt', 'secondWord')

	//Note: Both examples are Identical, but the first one is more readable
]);

const input = {
	SINGLELINE: {
		GERMAN: 'Hallo Welt',
		ENGLISH: 'Hello World',
	},
	MULTILINE: {
		GERMAN: 'Hallo\r\n\nWelt',
		ENGLISH: 'Hello\r\n\nWorld'
	}
};

export const output = {
	SINGLELINE: {
		GERMAN: SLD.Parser.create(multiLangRuleVariant).parse(input.SINGLELINE.GERMAN, false, false),
		ENGLISH: SLD.Parser.create(multiLangRuleVariant).parse(input.SINGLELINE.ENGLISH, false, false),
	},
	MULTILINE: {
		GERMAN: SLD.Parser.create(multiLangRuleVariant).parse(input.MULTILINE.GERMAN, false, false),
		ENGLISH: SLD.Parser.create(multiLangRuleVariant).parse(input.MULTILINE.ENGLISH, false, false),
	}
};