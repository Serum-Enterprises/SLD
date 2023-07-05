import { Rule, RuleInterface } from "./Rule";
import { Node } from "../lib/Node";
import { Grammar } from "./Grammar";

export interface VariantInterface {
    rules: RuleInterface[];
}

export class Variant {
    // Verify if the given variant is a valid VariantInterface
    static verifyInterface(variant: unknown, varName?: string): VariantInterface;

    // Convert a JSON-compatible VariantInterface to a Variant
    static fromJSON(json: any, path?: string, safe?: boolean): Variant;

    // Create a new Variant Instance
    constructor(rules: Rule[]);

    // Getters for all Properties
    get rules(): Rule[];

    // Executes the Variant on a source String with an optionally preceding Node and a Parser Context
    execute(input: string, precedingNode: Node | null, grammarContext: Grammar): unknown;

    // Convert the Variant to a JSON-compatible VariantInterface
    toJSON(): VariantInterface;
}