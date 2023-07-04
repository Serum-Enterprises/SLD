const Parser = require('./Parser');

const Node = require('../lib/Node');
const MisMatchError = require('../lib/errors/MisMatchError');

/**
 * @typedef {{type: 'STRING' | 'REGEXP' | 'VARIANT', value: string, name: string | null, greedy: boolean, optional: boolean}} ComponentInterface
 */

class TYPE {
    /**
     * @returns {'STRING'}
     */
    static get STRING() {
        return 'STRING';
    }

    /**
     * @returns {'REGEXP'}
     */
    static get REGEXP() {
        return 'REGEXP';
    }

    /**
     * @returns {'VARIANT'}
     */
    static get VARIANT() {
        return 'VARIANT';
    }
}

class Component {
    /**
     * @type {'STRING' | 'REGEXP' | 'VARIANT'}
     */
    #type;
    /**
     * @type {string}
     */
    #value;
    /**
     * @type {string | null}
     */
    #name;
    /**
     * @type {boolean}
     */
    #optional;
    /**
     * @type {boolean}
     */
    #greedy;

    /**
     * Create a new Component Instance
     * @param {'STRING' | 'REGEXP' | 'VARIANT'} type 
     * @param {string} value 
     * @param {string | null} name 
     * @param {boolean} optional 
     * @param {boolean} greedy
     * @throws {TypeError} if type is not a String
     * @throws {RangeError} if type is not "STRING", "REGEXP" or "VARIANT"
     * @throws {TypeError} if value is not a String
     * @throws {TypeError} if name is not a String or null
     * @throws {TypeError} if optional is not a Boolean
     * @throws {TypeError} if greedy is not a Boolean
     */
    constructor(type, value, name = null, optional = false, greedy = false) {
        if (typeof type !== 'string')
            throw new TypeError('Expected type to be a String');

        if (!['STRING', 'REGEXP', 'VARIANT'].includes(type.toUpperCase()))
            throw new RangeError('Expected type to be "STRING", "REGEXP" or "VARIANT"');

        if (typeof value !== 'string')
            throw new TypeError('Expected value to be a String');

        if (name !== null && typeof name !== 'string')
            throw new Error('Expected name to be a String or null');

        if (typeof optional !== 'boolean')
            throw new TypeError('Expected optional to be a Boolean');

        if (typeof greedy !== 'boolean')
            throw new TypeError('Expected greedy to be a Boolean');

        this.#type = type.toUpperCase();
        this.#value = value;
        this.#name = name;
        this.#optional = optional;
        this.#greedy = greedy;
    }

    /**
     * @returns {'STRING' | 'REGEXP' | 'VARIANT'}
     */
    get type() {
        return this.#type;
    }

    /**
     * @returns {string}
     */
    get value() {
        return this.#value;
    }

    /**
     * @returns {string | null}
     */
    get name() {
        return this.#name;
    }

    /**
     * @returns {boolean}
     */
    get optional() {
        return this.#optional;
    }

    /**
     * @returns {boolean}
     */
    get greedy() {
        return this.#greedy;
    }

    /**
     * @returns {(input: string, precedingNode: Node.Node | null, parserContext: Parser) => Node.Node}
     */
    get matchFunction() {
        switch (this.#type) {
            case TYPE.STRING:
                return (input, precedingNode, parserContext) => {
                    if (!input.startsWith(this.#value))
                        throw new MisMatchError(`Expected ${this.#value}`, precedingNode ? precedingNode.range[1] + 1 : 0);
                    if (precedingNode)
                        return new Node.Node(Node.TYPE.MATCH, this.#value, {}, [
                            precedingNode.range[1] + 1,
                            precedingNode.range[1] + this.#value.length
                        ]);
                    return new Node.Node(Node.TYPE.MATCH, this.#value, {}, [0, this.#value.length]);
                };
            case TYPE.REGEXP:
                return (input, precedingNode, parserContext) => {
                    const match = input.match(new RegExp(this.#value));
                    if (!match)
                        throw new MisMatchError(`Expected /${this.#value}/`, precedingNode ? precedingNode.range[1] + 1 : 0);
                    if (precedingNode)
                        return new Node.Node(Node.TYPE.MATCH, match[0], {}, [
                            precedingNode.range[1] + 1,
                            precedingNode.range[1] + this.#value.length
                        ]);
                    return new Node.Node(Node.TYPE.MATCH, this.#value, {}, [0, this.#value.length]);
                };
            case TYPE.VARIANT:
                return (input, precedingNode, parserContext) => {
                    const ruleVariant = parserContext.variants.get(this.#value);
                    return ruleVariant.execute(input, precedingNode, parserContext);
                };
        }
    }

    /**
     * Verify if the given component is a valid ComponentInterface
     * @param {unknown} component 
     * @param {string} [varName='component'] 
     * @returns {ComponentInterface}
     */
    static verifyInterface(component, varName = 'component') {
        if (Object.prototype.toString.call(component) !== '[object Object]')
            throw new TypeError(`Expected ${varName} to be an Object`);

        if (typeof component.type !== 'string')
            throw new TypeError(`Expected ${varName}.type to be a String`);

        if (!['STRING', 'REGEXP', 'VARIANT'].includes(component.type.toUpperCase()))
            throw new RangeError(`Expected ${varName}.type to be "STRING", "REGEXP" or "VARIANT"`);

        if (typeof component.value !== 'string')
            throw new TypeError(`Expected ${varName}.value to be a String`);

        if (component.name !== null && typeof component.name !== 'string')
            throw new TypeError(`Expected ${varName}.name to be a String or null`);

        if (typeof component.optional !== 'boolean')
            throw new TypeError(`Expected ${varName}.optional to be a Boolean`);

        if (typeof component.greedy !== 'boolean')
            throw new TypeError(`Expected ${varName}.greedy to be a Boolean`);

        return component;
    }
}

module.exports = { TYPE, Component };