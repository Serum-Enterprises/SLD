## Overview

The Builder of the Serum Language Designer provides a structured approach to defining grammars using TypeScript. The system is constructed around several core components that enable users to define complex grammars by composing simpler structures via a simple and easy to use API.

## Core Components

### Component Class

#### Overview
A `Component` represents a basic symbol or token in the grammar. It is analogous to a symbol in BNF grammars and can represent a string, a regular expression, or a variant. They should never be created by themselves, but only by utilizing Methods in the `Rule` Class.

### Rule Class

#### Overview
A `Rule` represents a sequence of `Component`s, defining a valid string within the grammar.

#### Methods
* `public static get match(): QuantitySelector`: Create a new Rule by starting to match something defined by QuantitySelector.
* `public static throw(message: string): Rule`: Create a Rule that always throws an Error Message. This is particularly helpful as a default Rule in Variants.
- `get(...components: Component[])`: Creates and returns a new `Rule` instance with the provided components.

### 3. Variant

#### Overview
A `Variant` manages a collection of `Rule` instances and provides functionality for handling them as a group.

#### Properties
- `_rules`: An array of `Rule` instances.

#### Methods
- `create(rules: Rule[])`: Creates and returns a new `Variant` instance with the provided rules.
- `addRule(rule: Rule)`: Adds a new rule to the `_rules` array.
- `toJSON()`: Returns a JSON-serializable object, converting each rule using its `toJSON` method.

### 4. Grammar

#### Overview
A `Grammar` manages a collection of named `Variant` instances, providing a top-level structure for defining the grammar.

#### Properties
- `_variants`: A map of variant names to `Variant` instances.

#### Methods
- `create(variants: { [key: string]: Variant })`: Creates and returns a new `Grammar` instance with the provided variants.

## Workflow

1. **Define Components**: Utilize the `Component` class to define basic symbols or tokens in your grammar.

2. **Create Rules**: Utilize the `Rule` class to define sequences of components, forming valid strings in your language.

3. **Manage Variants**: Utilize the `Variant` class to manage groups of rules, handling them as unified entities.

4. **Construct Grammar**: Utilize the `Grammar` class to define the overall grammar, managing various variants.

5. **Generate JSON**: Convert the defined grammar to a JSON format, potentially using the `toJSON` methods available in the components.

## Example Usage

Due to the complexity and abstraction of the codebase, providing detailed examples might require further understanding of the logic and interactivity between the methods. However, based on the provided information, the general usage might look like this:

```typescript
import { Component, Rule, Variant, Grammar } from 'path-to-builder';

// Define Components
let componentA = new Component(/*...*/);

// Define Rules using Components
let ruleA = Rule.get(componentA, /*...*/);

// Group Rules into Variants
let variantA = Variant.create([ruleA, /*...*/]);

// Define the Grammar using Variants
let grammar = Grammar.create({variantName: variantA});

// Convert Grammar to JSON
let jsonGrammar = JSON.stringify(grammar.toJSON());
```

## Note

This documentation is formed based on a preliminary analysis of the provided code snippets. For a more accurate and detailed guide, further exploration and understanding of the codebase are required. If you have any specific questions or need further details in any part, feel free to ask!