import { Variant, VariantInterface } from "./Variant";

export interface GrammarInterface {
	variants: {
		[name: string]: VariantInterface;
	};
}

export class Grammar {
	// Verify if the given grammar is a valid ParserInterface
	static verifyInterface(grammar: unknown, varName?: string): GrammarInterface;

	// Convert a JSON-compatible GrammarInterface to a Grammar
	static fromJSON(json: GrammarInterface, path?: string, safe?: boolean): Grammar;

	// Create a new Grammar Instance
	constructor(variants?: Map<string, Variant>);

	// Getters for all Properties
	get variants(): Map<string, Variant>;

	// Executes the Grammar on a source String
	execute(input: string, rootVariant: string): unknown;

	// Convert the Grammar to a JSON-compatible GrammarInterface
	toJSON(): GrammarInterface;
}