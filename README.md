# Serum Language Designer (SDL)

This Language Designer is made to provide an easy way of creating formal Grammars and parsing a string against them. They are based on a Graph-Node System, which allows for easy creation of complex Grammars and optimization of said Grammars by specific Rules.

## Introduction

### Terms

Every Grammar consists of Terms. A Term is a single Node in the Grammar Graph and can represent either a fixed String or a Regular Expression.
If it can't match the String or RegExp against the source String, it will throw a MisMatch Error.

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