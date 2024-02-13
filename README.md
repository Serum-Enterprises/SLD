# Serum Language Designer

The Serum Language Designer (SLD) is a powerful Tool to create and parse Languages.

## Features
- Easy and self-explaining Syntax
- Direct Parsing of Source to AST
- Source String Range for each Node and Error
- Recovery from Errors with Symbols
- Customizable Error Messages
- Transforming Hooks for AST Nodes

## Usage

### Installation

To install the SLD, you can use the following command:

```sh
npm install serum-language-designer
```

### Import

To import the SLD, you can use the following code:

```js
const { Core, Builder, Parser: { Parser } } = require('./index');
const { Grammar, Rule, RuleSet } = Builder;
const { Node } = Core;
```

### Example

Here we create a simple Greeting Grammar:
```js
const grammar = Grammar.create({
	Greeting: RuleSet.create([
		Rule.match().one().ruleset('German', 'greeting')
			.followedBy().one().regexp(/[a-zA-Z]+/, 'name'),
		Rule.match().one().ruleset('English', 'greeting')
			.followedBy().one().regexp(/[a-zA-Z]+/, 'name'),
	])
		.transform(node => {
			const greeting = node.children.greeting[0].raw;
			const name = node.children.name[0].raw;
			const output = `${name} was greeted with ${greeting}!`;

			return new Node(
				'MATCH',
				output,
				{},
				[0, output.length - 1]
			);
		}),
	German: RuleSet.create([
		Rule.match().one().string('Hallo'),
		Rule.match().one().string('Guten Tag'),
	]),
	English: RuleSet.create([
		Rule.match().one().string('Hello'),
		Rule.match().one().string('Good Day'),
	]),
});
```

Once we have the Grammar, we can create a Parser and parse a Source:

```js
const parser = new Parser(grammar);

console.log(
	JSON.stringify(
		parser.parse('Hello John', 'Greeting'),
		null,
		2
	)
);
```

The output will be:

```json
{
  "type": "MATCH",
  "value": "John was greeted with Hello!",
  "children": {},
  "range": [
	0,
	23
  ]
}
```

## API

### Modules

Core
|- Node
|
|- BaseSymbol
|- SymbolSet
|- Rule
|- RuleSet
|- Grammar

Builder
|- BaseSymbol
|- SymbolSet
|- Rule
|- RuleSet
|- Grammar

Parser
|- Node
|
|- Parser
|- MisMatchError
|- CustomError