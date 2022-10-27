# Serum Language Designer

The Serum Language Designer (SLD) is a Suite of Tools for designing General Purpose Languages (GPLs), as well as Domain Specific Languages (DSLs). It features a powerful Notation, called the Serum Grammar Notation (SGN), which is used to describe the Syntax of a Language. Integrated in the Suite is also a Parser, which takes a Document written in the SGN and creates an AST from the Grammar.

## Serum Grammar Notation

The SGN is a Notation for describing the Syntax of a Language. It is heavily influenced by the [EBNF](https://en.wikipedia.org/wiki/Extended_Backus%E2%80%93Naur_form) Notation, as well as Typescript Definitions. The SGN is designed to be as easy to read as possible, while still being able to describe complex Grammars and desired AST.

### Symbols

#### Identifiers

Identifiers are used to name Production Rules, Namespaces and Interfaces. They follow the RegExp of `[a-zA-Z]+`. Per Convention they are written in UpperCamelCase, also known as PascalCase.

#### Strings

Strings are used to describe the actual Text of a Language. They are written in single quotes, and can contain any character, except for unescaped single quotes. Strings can be used to describe Keywords, as well as Literals.

#### Regular Expressions

Regular Expressions are an alternate Form to Strings, designed to describe a more complex Pattern. They are written in double quotes and follow the ECMAScript RegExp Syntax.

#### Concatenation

Concatenation is used to combine Symbols. There are two types of Concatenation, the "followed-by" and "directly-followed-by" Concatenation.

"Followed-By" is written as a `>` between Symbols. It means that the Symbols are directly next to each other, but can be separated by any amount of whitespace.

"Directly-Followed-By" is written as a `>=` between Symbols. It means that the Symbols are directly next to each other, without any whitespace in between.

#### Grouping

Grouping is used to group Symbols together. It is written as a `(` and a `)` around a Symbol. Grouping is used to change the Order of Operations.

#### Alternations

Alternations are used to describe a choice between multiple Symbols. It is written as a `|` between Symbols. Alternations are used to describe optional Symbols. They follow a short-circuiting logic, meaning that the first Symbol that matches will be used.

### Production Rules

### Namespaces & Interfaces