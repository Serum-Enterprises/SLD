import { Component, ComponentInterface } from "./Component";
import { Node } from "../lib/Node";
import { Grammar } from "./Grammar";

export interface RuleInterface {
	components: ComponentInterface[];
	autoThrow: string | null;
	autoRecover: ComponentInterface | null;
}

export class Rule {
	// Verify if the given rule is a valid RuleInterface
	static verifyInterface(rule: unknown, varName?: string): RuleInterface;

	// Convert a JSON-compatible RuleInterface to a Rule
	static fromJSON(json: RuleInterface, path?: string, safe?: boolean): Rule;

	// Create a new Rule Instance
	constructor(components: Component[], autoThrow?: string | null, autoRecover?: Component | null);

	// Getters for all Properties
	get components(): Component[];
	get autoThrow(): string;
	get autoRecover(): Component;

	// Executes the Rule on a source String with an optionally preceding Node and a Parser Context
	execute(input: string, precedingNode: Node | null, grammarContext: Grammar): unknown;

	// Convert the Rule to a JSON-compatible RuleInterface
	toJSON(): RuleInterface;
}