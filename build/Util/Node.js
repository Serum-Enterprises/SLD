"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Node = void 0;
class Node {
    _type;
    _raw;
    _children;
    _range;
    _meta;
    /**
     * Merge two NodeMaps
     */
    static mergeNodeMaps(nodeMaps) {
        const result = new Map();
        nodeMaps.forEach(nodeMap => {
            nodeMap.forEach((value, key) => {
                if (!result.has(key))
                    result.set(key, []);
                value.forEach(node => result.get(key).push(node));
            });
        });
        return result;
    }
    /**
     * Create a new node
     */
    static create(raw, children) {
        return children.match(children => new Node("MATCH", raw, children, [0, raw.length - 1], {}), () => new Node("RECOVER", raw, new Map(), [0, raw.length - 1], {}));
    }
    /**
     * Create a node with an optional preceding node
     */
    static createFollowerWith(precedingNode, raw, children) {
        return precedingNode.match(precedingNode => precedingNode.createFollower(raw, children), () => Node.create(raw, children));
    }
    /**
     * Construct a new node
     */
    constructor(type, raw, children, range, meta) {
        this._type = type;
        this._raw = raw;
        this._children = children;
        this._range = range;
        this._meta = meta;
    }
    get type() {
        return this._type;
    }
    get raw() {
        return this._raw;
    }
    get children() {
        return this._children;
    }
    get range() {
        return this._range;
    }
    get meta() {
        return this._meta;
    }
    set meta(meta) {
        this._meta = meta;
    }
    setMeta(meta) {
        this.meta = meta;
        return this;
    }
    /**
     * Create a node logically following this node
     */
    createFollower(raw, children) {
        return children.match(children => new Node("MATCH", raw, children, [this._range[1] + 1, this._range[1] + raw.length], {}), () => new Node("RECOVER", raw, new Map(), [this._range[1] + 1, this._range[1] + raw.length], {}));
    }
    toJSON() {
        const children = {};
        this._children.forEach((value, key) => {
            children[key] = value;
        });
        return {
            type: this._type,
            raw: this._raw,
            children: Array.from(this._children.entries()).reduce((result, [key, value]) => {
                return { ...result, [key]: value };
            }, {}),
            range: this._range,
            meta: this._meta
        };
    }
}
exports.Node = Node;
