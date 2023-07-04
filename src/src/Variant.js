const Rule = require('./Rule');
const Parser = require('./Parser');

const Node = require('../lib/Node');
const VariantError = require('../lib/errors/VariantError');

/**
 * @typedef {{rules: Rule.RuleInterface[]}} VariantInterface
 */

class Variant {
    /**
     * @type {Rule[]}
     */
    #rules;

    /**
     * Create a new Variant Instance
     * @param {Rule[]} rules 
     * @throws {TypeError} if rules is not an Array of Rule Instances
     */
    constructor(rules) {
        if (!(Array.isArray(rules) && rules.every(rule => rule instanceof Rule)))
            throw new TypeError('Expected rules to be an Array of Rule Instances');

        this.#rules = rules;
    }

    /**
     * @returns {Rule[]}
     */
    get rules() {
        return this.#rules;
    }

    /**
     * Executes the Variant on a source String with an optionally preceding Node and a Parser Context
     * @param {string} input 
     * @param {Node.Node | null} precedingNode 
     * @param {Parser} parentParser 
     * @returns {unknown}
     * @throws {TypeError} if input is not a String
     * @throws {TypeError} if precedingNode is not an instance of Node or null
     * @throws {TypeError} if parentParser is not an instance of Parser
     * @throws {VariantError} if no Rule matched
     */
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

    /**
     * Verify if the given variant is a valid VariantInterface
     * @param {unknown} variant 
     * @param {string} [varName='variant'] 
     * @returns {VariantInterface}
     */
    static verifyInterface(variant, varName = 'variant') {
        if (Object.prototype.toString.call(variant) !== '[object Object]')
            throw new TypeError(`Expected ${varName} to be an Object`);

        if (!Array.isArray(variant.rules))
            throw new TypeError(`Expected ${varName}.rules to be an Array`);

        variant.rules.forEach((rule, index) => Rule.verifyInterface(rule, `${varName}.rule[${index}]`));

        return variant;
    }

    /**
     * Convert this Variant to a JSON-compatible VariantInterface
     * @returns {VariantInterface}
     */
    toJSON() {
        return {
            rules: this.#rules.map(rule => rule.toJSON())
        };
    }
}

module.exports = { Variant };