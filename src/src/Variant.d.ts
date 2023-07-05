import Rule from "./Rule";
import Node from "../lib/Node";
import Parser from "./Parser";

export interface VariantInterface {
    rules: Rule.RuleInterface[];
}

export class Variant {
    // Verify if the given variant is a valid VariantInterface
    static verifyInterface(variant: unknown, varName?: string): VariantInterface;

    // Convert a JSON-compatible VariantInterface to a Variant
    static fromJSON(json: any, path?: string, safe?: boolean): Variant;

    // Create a new Variant Instance
    constructor(rules: (typeof Rule)[]);

    // Getters for all Properties
    get rules(): (typeof Rule)[];

    // Executes the Variant on a source String with an optionally preceding Node and a Parser Context
    execute(input: string, precedingNode: Node.Node | null, parentParser: typeof Parser): unknown;

    // Convert the Variant to a JSON-compatible VariantInterface
    toJSON(): VariantInterface;
}