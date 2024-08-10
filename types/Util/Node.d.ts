import { Option } from './Option';
export declare type JSON = null | boolean | number | string | Array<JSON> | {
    [key: string]: JSON;
};
export declare class Node {
    private _type;
    private _raw;
    private _children;
    private _range;
    private _meta;
    /**
     * Merge two NodeMaps
     */
    static mergeNodeMaps(nodeMaps: Map<string, Node[]>[]): Map<string, Node[]>;
    /**
     * Create a new node
     */
    static create(raw: string, children: Option<Map<string, Node[]>>): Node;
    /**
     * Create a node with an optional preceding node
     */
    static createFollowerWith(precedingNode: Option<Node>, raw: string, children: Option<Map<string, Node[]>>): Node;
    /**
     * Construct a new node
     */
    constructor(type: string, raw: string, children: Map<string, Node[]>, range: [number, number], meta: {
        [key: string]: JSON;
    });
    get type(): string;
    get raw(): string;
    get children(): Map<string, Node[]>;
    get range(): [number, number];
    get meta(): {
        [key: string]: JSON;
    };
    set meta(meta: {
        [key: string]: JSON;
    });
    setMeta(meta: {
        [key: string]: JSON;
    }): Node;
    /**
     * Create a node logically following this node
     */
    createFollower(raw: string, children: Option<Map<string, Node[]>>): Node;
    toJSON(): JSON;
}
