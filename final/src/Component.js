const Node = require('../lib/Node');
const MisMatchError = require('../lib/errors/MisMatchError');

class TYPE {
    static get STRING() {
        return 'STRING';
    }

    static get REGEXP() {
        return 'REGEXP';
    }

    static get VARIANT() {
        return 'VARIANT';
    }
}

class Component {
    #type;
    #value;
    #name;
    #optional;
    #greedy;

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

    get type() {
        return this.#type;
    }

    get value() {
        return this.#value;
    }

    get name() {
        return this.#name;
    }

    get optional() {
        return this.#optional;
    }

    get greedy() {
        return this.#greedy;
    }

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

    toJSON() {
        return {
            type: this.#type,
            value: this.#value,
            name: this.#name,
            optional: this.#optional,
            greedy: this.#greedy
        };
    }

    static verify(data, varName = 'data') {
        if (Object.prototype.toString.call(data) !== '[object Object]')
            throw new TypeError(`Expected ${varName} to be an Object`);

        if (typeof data.type !== 'string')
            throw new TypeError(`Expected ${varName}.type to be a String`);

        if (!['STRING', 'REGEXP', 'VARIANT'].includes(data.type.toUpperCase()))
            throw new RangeError(`Expected ${varName}.type to be "STRING", "REGEXP" or "VARIANT"`);

        if (typeof data.value !== 'string')
            throw new TypeError(`Expected ${varName}.value to be a String`);

        if (data.name !== null && typeof data.name !== 'string')
            throw new TypeError(`Expected ${varName}.name to be a String or null`);

        if (typeof data.optional !== 'boolean')
            throw new TypeError(`Expected ${varName}.optional to be a Boolean`);

        if (typeof data.greedy !== 'boolean')
            throw new TypeError(`Expected ${varName}.greedy to be a Boolean`);

        return data;
    }

    static fromJSON(json, varName = 'json') {
        const verifiedData = Component.verify(json, varName);

        return new Component(
            verifiedData.type.toUpperCase(),
            verifiedData.value,
            verifiedData.name,
            verifiedData.optional,
            verifiedData.greedy
        );
    }
}

module.exports = { TYPE, Component };