# Serum Language Designer (SDL)

The Serum Language Designer is a Tool to create formal Grammars for a wide variety of Languages, from Programming Languages to Natural Languages.

Additionally it supports a Grammar Interpreter which can be used as a Parser.

## Repository Structure

This Repository contains mainly 3 Folders:
- **\[D] ./Builder** - contains a Tool to simplify the creation and description of Grammars
- **\[D] ./Parser** - contains the Grammar Parser that converts Strings and Grammars into ASTs
- **\[D] ./lib** - a Global Library containing the Base Definition of `BaseSymbol`, `SymbolSet`, `Rule` and `Grammar`

## Terminology

* `BaseSymbol` is a Data Structure representing either a Non-Terminal Symbol, a Terminal Symbol or another RuleSet. It consists of the following Properties:
	* `type` a String either being `STRING`, `REGEXP` or `VARIANT`
	* `value` a String containing the matcher, like a String, a RegExp or a Variant Name
	* `name` a String or null defining a Name for this Symbol
* `SymbolSet` is a Data Structure representing a Set of BaseSymbols with an optional and greedy modifier. It has the following Properties:
	* `symbols` an Array of `BaseSymbol` 
	* `optional` a Boolean indicating that this SymbolSet is optional
	* `greedy` a Boolean indicating that this SymbolSet should be matched as much as possible
* `Rule` is a Data Structure representing a a Logical Instance that can either succeed or fail, depending on the following Properties
	* `symbolSets` is an Array of SymbolSet, containing 
## Introduction

### Terminology

* `Symbol` - A Symbol is the smallest Matching Unit and can either be a
	* `Terminal Symbol` - is a printable String
	* `Non-Terminal Symbol` - is a non-printable String, such as another Rule
* `Rule` - A combination of Symbols
* `Grammar` - A combination of Rules

## Parser

The Parser has the following Architecture
### 

## Internals
A Grammar Node has 5 important Properties:
- `Match`: A Regular Expression or String that is used to match the source String
- `Name`: An optional the Name of the Node (to be included in the final AST)
- `Greedy`: A boolean that determines whether the Node should be greedy or not (i.e. match as much as possible)
- `Optional`: A boolean that determines whether the Node is optional or not (i.e. match 0 or 1 times)
- `Children`: A list of Grammar Nodes that are children of this Grammar Node

Parsing Strategy:
- If the current Node is not a Custom Throw Node, try to match the current Node
	- On Error, return a MisMatch Error
	- On Success, try to match all Children
		- If one of the Children fails, continue with the next one
		- If all Children fail, try to recover with a recovery Component
			- If the recovery Component fails, return a MisMatch Error
			- If the recovery Component succeeds, return a Recovery Node
		- On Success, return a Match Node
- If the current Node is a Custom Throw Node, throw a Custom Error