import Component from "./Component";
import Node from "../lib/Node";
import Parser from "./Parser";

export interface RuleInterface {
	components: Component.ComponentInterface[];
	autoThrow: string | null;
	autoRecover: Component.ComponentInterface | null;
}

export class Rule {
	// Verify if the given rule is a valid RuleInterface
	static verifyInterface(rule: unknown, varName?: string): RuleInterface;

	// Convert a JSON-compatible RuleInterface to a Rule
	static fromJSON(json: RuleInterface, path?: string, safe?: boolean): Rule;

	// Create a new Rule Instance
	constructor(components: Component.Component[], autoThrow?: string | null, autoRecover?: Component.Component | null);

	// Getters for all Properties
	get components(): Component.Component[];
	get autoThrow(): string;
	get autoRecover(): Component.Component;

	// Executes the Rule on a source String with an optionally preceding Node and a Parser Context
	execute(input: string, precedingNode: Node.Node | null, parentParser: typeof Parser): unknown;

	// Convert the Rule to a JSON-compatible RuleInterface
	toJSON(): RuleInterface;
}