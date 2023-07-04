import Node from '../lib/Node';
import Parser from './Parser';

export interface ComponentInterface {
	type: 'STRING' | 'REGEXP' | 'VARIANT';
	value: string;
	name: string | null;
	greedy: boolean;
	optional: boolean;
}

export type matchFunction = (input: string, precedingNode: Node.Node | null, parserContext: typeof Parser) => Node.Node;

export class Component {
	// Verify if the given component is a valid ComponentInterface
	static verifyInterface(component: unknown, varName?: string): ComponentInterface;

	// Convert a JSON-compatible ComponentInterface to a Component
	static fromJSON(json: ComponentInterface, path?: string, safe?: boolean): Component;

	// Create a new Component Instance
	constructor(type: 'STRING' | 'REGEXP' | 'VARIANT', value: string, name?: string | null, optional?: boolean, greedy?: boolean);

	// Getters for all Properties
	get type(): "STRING" | "REGEXP" | "VARIANT";
	get value(): string;
	get name(): string;
	get optional(): boolean;
	get greedy(): boolean;

	// Convenience Getter (constructs a matchFunction from the Component)
	get matchFunction(): matchFunction;

	// Convert the Component to a JSON-compatible ComponentInterface
	toJSON(): ComponentInterface;
}