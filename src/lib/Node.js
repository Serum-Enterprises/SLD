/**
 * @typedef {{type: 'MATCH' | 'RECOVER', raw: string, children: {[key: string]: NodeInterface | NodeInterface[]}, range: [number, number]}} NodeInterface
 */

class Node {
    #type;
    #raw;
    #children;
    #range;

    /**
     * Verify that the given node is a valid NodeInterface
     * @param {unknown} node 
     * @param {string} [varName = 'node']
     * @returns {NodeInterface}
     */
    static verifyInterface(node, varName = 'node') {
        if (typeof varName !== 'string')
            throw new TypeError('Expected varName to be a String');

        if (Object.prototype.toString.call(node) !== '[object Object]')
            throw new TypeError(`Expected ${varName} to be an Object`);

        if (typeof node.type !== 'string')
            throw new TypeError(`Expected ${varName}.type to be a String`);

        if (!['MATCH', 'RECOVER'].includes(node.type.toUpperCase()))
            throw new RangeError(`Expected ${varName}.type to be either "MATCH" or "RECOVER"`);

        if (typeof node.raw !== 'string')
            throw new TypeError(`Expected ${varName}.raw to be a String`);

        if (Object.prototype.toString.call(node.children) !== '[object Object]')
            throw new TypeError(`Expected ${varName}.children to be an Object`);

        Object.entries(node.children).forEach(([name, child]) => {
            if (Array.isArray(child))
                child.forEach((child, index) => {
                    Node.verifyInterface(child, `${varName}.children.${name}[${index}]`);
                });
            else if (Object.prototype.toString.call(child) === '[object Object]')
                Node.verifyInterface(child, `${varName}.children.${name}`);
            else
                throw new TypeError(`Expected ${varName}.children.${name} to be a Node Interface or an Array of Node Interfaces`);
        });

        if (!Array.isArray(node.range))
            throw new TypeError(`Expected ${varName}.range to be an Array`);

        if (node.range.length !== 2)
            throw new RangeError(`Expected ${varName}.range to be an Array of length 2`);

        node.range.forEach((value, index) => {
            if (!Number.isSafeInteger(value))
                throw new TypeError(`Expected ${varName}.range[${index}] to be an Integer`);

            if (value < 0)
                throw new RangeError(`Expected ${varName}.range[${index}] to be greater than or equal to 0`);
        });

        return node;
    }

    /**
     * Create a new Node Instance from a NodeInterface
     * @param {NodeInterface} node 
     * @param {string} [varName = 'node'] 
     * @returns {Node}
     */
    static fromJSON(node, varName = 'node') {
        if (typeof varName !== 'string')
            throw new TypeError('Expected varName to be a String');

        Node.verifyInterface(node, varName);

        return new Node(
            node.type,
            node.raw,
            Object.entries(node.children).reduce((children, [name, child]) => {
                if (Array.isArray(child))
                    children[name] = child.map(child => Node.fromJSON(child, `${varName}.children.${name}`));
                else
                    children[name] = Node.fromJSON(child, `${varName}.children.${name}`);

                return children;
            }, {}),
            node.range
        );
    }

    /**
     * Create a new Node Instance
     * @param {'MATCH' | 'RECOVER'} type 
     * @param {string} raw 
     * @param {{ [key: string]: Node | Node[] }} children 
     * @param {[number, number]} range 
     */
    constructor(type, raw, children, range) {
        if (typeof type !== 'string')
            throw new TypeError('Expected type to be a String');

        if (!['MATCH', 'RECOVER'].includes(type.toUpperCase()))
            throw new RangeError('Expected type to be either "MATCH" or "RECOVER"');

        if (typeof raw !== 'string')
            throw new TypeError('Expected raw to be a String');

        if (Object.prototype.toString.call(children) !== '[object Object]')
            throw new TypeError('Expected children to be an Object');

        Object.entries(children).forEach(([key, value]) => {
            if (!((value instanceof Node) || (Array.isArray(value) && value.every(child => child instanceof Node))))
                throw new TypeError(`Expected children.${key} to be an instance of Node or an Array of Node Instances`);
        });

        if (!Array.isArray(range))
            throw new TypeError('Expected range to be an Array');

        if (range.length !== 2)
            throw new RangeError('Expected range to be an Array of length 2');

        range.forEach((value, index) => {
            if (!Number.isSafeInteger(value))
                throw new TypeError(`Expected range[${index}] to be an Integer`);

            if (value < 0)
                throw new RangeError(`Expected range[${index}] to be greater than or equal to 0`);
        });

        this.#type = type.toUpperCase();
        this.#raw = raw;
        this.#children = children;
        this.#range = range;
    }

    /**
     * Get the type of the Node
     * @returns {'MATCH' | 'RECOVER'}
     */
    get type() {
        return this.#type;
    }

    /**
     * Get the raw value of the Node
     * @returns {string}
     */
    get raw() {
        return this.#raw;
    }

    /**
     * Get the children of the Node
     * @returns {{ [key: string]: Node | Node[] }}
     */
    get children() {
        return this.#children;
    }

    /**
     * Get the range of the Node
     * @returns {[number, number]}
     */
    get range() {
        return this.#range;
    }

    /**
     * Convert the Node to a NodeInterface
     * @returns {NodeInterface}
     */
    toJSON() {
        return {
            type: this.#type,
            raw: this.#raw,
            children: Object.entries(this.#children).reduce((children, [name, child]) => {
                if (Array.isArray(child))
                    children[name] = child.map(child => child.toJSON());
                else
                    children[name] = child.toJSON();

                return children;
            }, {}),
            range: this.#range
        };
    }
}

module.exports = Node;