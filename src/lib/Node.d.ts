export interface NodeInterface {
    type: 'MATCH' | 'RECOVER';
    raw: string;
    children: {
        [name: string]: NodeInterface | NodeInterface[];
    };
    range: [number, number];
}

export class Node {
    // Verify if the given node is a valid NodeInterface
    static verifyInterface(node: unknown, varName?: string): NodeInterface;

    // Convert a JSON-compatible NodeInterface to a Node
    static fromJSON(json: NodeInterface, path?: string, safe?: boolean): Node;

    // Create a new Node Instance
    constructor(type: 'MATCH' | 'RECOVER', raw: string, children: { [name: string]: Node | Node[] }, range: [number, number]);

    // Getters for all Properties
    get type(): string;
    get raw(): string;
    get children(): { [name: string]: Node | Node[] };
    get range(): number[];

    // Convert the Node to a JSON-compatible NodeInterface
    toJSON(): NodeInterface;
}
