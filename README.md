# Serum Language Designer

The Serum Language Designer (SLD) is an Interpreter for Parsing-Expression-Grammars (PEGs) written in TypeScript. It can be used to parse any Programming Language, Data Format, Configuration File, Markup Language and Domain-specific Language (DSL). It is closely related to Context-Free Grammars (CFGs) and Regular Expressions (REs), but is more powerful than both.

## Installation

This Library can be installed using npm:

```bash
npm install serum-language-designer
```

## Usage

This Library has multiple Classes and Interfaces that are relevant for the usage of the Library. The most important Classes are:

-   `Parser`: The Parser Class is the main Class of the Library. It is used to parse a given Input String using its registered Variants.
-   `Variant`: Variants are an Ordered-Choice of Parsing Rules.
-   `Rule`: Rules are the Building Blocks of a Variant. They can match the input based on Strings, Regular Expressions, Variants and have utility matchers such as `followedByOne`, `directlyFollowedByOne`, as well as `followedByZeroOrMore`, `followedByOneOrMore` and `followedByZeroOrOne`.
-	`MatchEngine`: The MatchEngine allows to manually build `matchFunctions`, for the matchers in the Rule Class. There are 4 available factory Methods: `matchString`, `matchRegExp`, `matchVariant` and `matchWhitespace`.

The usage of the Library is best explained by the following example:

```typescript
import * as SLD from '@serum-enterprises/sld';
```

This imports all Classes from the SLD into the current File. Those include `Parser`, `Variant`, `Rule`, `MatchEngine`, `Result`, `Node`, `Problem` and `Meta`.

```typescript
const greeting: SLD.Variant = SLD.Variant.create([
	// English
	SLD.Rule.matchOne('Hello', 'firstWord')
		.followedByOne('World', 'secondWord'),
	// German
	SLD.Rule.matchOne('Hallo', 'firstWord')
		.followedByOne('Welt', 'secondWord')
]);
```

The next Step is to create a Variant containing one or more Rules. In this Case we have two Rules, the first one matching `Hello`, followed by any amount of Whitespaces or Newlines, followed by `World`. The second Rule is the same, but in German. If you want to match those Rules without a Whitespace or Newline in between, you can use `directlyFollowedByOne` instead of `followedByOne`.

```typescript

```typescript

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

const OPTIONS = {
	META: false,
	CHILDREN: false
}

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