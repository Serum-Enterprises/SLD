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

const output = {
	SINGLELINE: {
		GERMAN: SLD.Parser.create(multiLangRuleVariant).parse(input.SINGLELINE.GERMAN),
		ENGLISH: SLD.Parser.create(multiLangRuleVariant).parse(input.SINGLELINE.ENGLISH),
	},
	MULTILINE: {
		GERMAN: SLD.Parser.create(multiLangRuleVariant).parse(input.MULTILINE.GERMAN),
		ENGLISH: SLD.Parser.create(multiLangRuleVariant).parse(input.MULTILINE.ENGLISH),
	}
};

console.log(JSON.stringify(output, null, 2));