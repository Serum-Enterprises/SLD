const Rule = require('./Rule');
const Parser = require('./Parser');

const Node = require('../lib/Node');
const VariantError = require('../lib/errors/VariantError');

class Variant {
    #rules;

    constructor(rules) {
        if (!(Array.isArray(rules) && rules.every(rule => rule instanceof Rule)))
            throw new TypeError('Expected rules to be an Array of Rule Instances');

        this.#rules = rules;
    }

    get rules() {
        return this.#rules;
    }

    execute(input, precedingNode, parentParser) {
        if (typeof input !== 'string')
            throw new TypeError('Expected input to be a string');

        if (!(precedingNode instanceof Node.Node) && (precedingNode !== null))
            throw new TypeError('Expected precedingNode to be an instance of Node or null');

        if (!(parentParser instanceof Parser))
            throw new TypeError('Expected parentParser to be an instance of Parser');

        for (const rule of this.#rules) {
            try {
                return rule.execute(input, precedingNode, parentParser);
            }
            catch (error) { }
        }

        throw new VariantError('No Rule matched', precedingNode ? precedingNode.range[1] + 1 : 0);
    }

    static verifyInterface(variant, varName = 'variant') {
        if (Object.prototype.toString.call(variant) !== '[object Object]')
            throw new TypeError(`Expected ${varName} to be an Object`);

        if (!Array.isArray(variant.rules))
            throw new TypeError(`Expected ${varName}.rules to be an Array`);

        variant.rules.forEach((rule, index) => Rule.verifyInterface(rule, `${varName}.rule[${index}]`));

        return variant;
    }

    toJSON() {
        return {
            rules: this.#rules.map(rule => rule.toJSON())
        };
    }

    static fromJSON(json, path = 'json', safe = true) {
        if (typeof path !== 'string')
            throw new TypeError('Expected path to be a string');

        if (typeof safe !== 'boolean')
            throw new TypeError('Expected safe to be a boolean');

        if (safe)
            Variant.verifyInterface(json, path);

        return new Variant(json.rules.map((rule, index) => Rule.fromJSON(rule, `${path}.rules[${index}]`, false)));
    }
}

module.exports = { Variant };