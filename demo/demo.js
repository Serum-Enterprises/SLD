const { Grammar, Variant, Rule } = require('../src/Builder');

const multiLangRuleVariant = Variant.create([
	// English
	Rule.begin().match('STRING', 'Hello', 'firstWord')
		.followedBy().one().string('World', 'secondWord'),
	// German
	Rule.begin().match('STRING', 'Hallo', 'firstWord')
		.followedBy().one().string('Welt', 'secondWord')

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