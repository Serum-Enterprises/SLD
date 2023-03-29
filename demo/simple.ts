import * as SLD from '../src/index';

const multiLangRuleVariant: SLD.Variant = SLD.Variant.create([
	// English
	SLD.Rule.begin('Hello', 'firstWord')
		.followedBy('World', 'secondWord'),
	// German
	SLD.Rule.begin('Hallo', 'firstWord')
		.followedBy('Welt', 'secondWord')
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
		GERMAN: SLD.Parser.create(multiLangRuleVariant).parse(input.SINGLELINE.GERMAN, true, true),
		ENGLISH: SLD.Parser.create(multiLangRuleVariant).parse(input.SINGLELINE.ENGLISH, true, true),
	},
	MULTILINE: {
		GERMAN: SLD.Parser.create(multiLangRuleVariant).parse(input.MULTILINE.GERMAN, true, true),
		ENGLISH: SLD.Parser.create(multiLangRuleVariant).parse(input.MULTILINE.ENGLISH, true, true),
	}
};