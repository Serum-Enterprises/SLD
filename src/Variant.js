const { Rule } = require('./Rule');
const { Grammar } = require('./Grammar');

const { Node } = require('../lib/Node');
const { VariantError } = require('../lib/errors/VariantError');

/**
 * @typedef {Rule.RuleInterface[]} VariantInterface
 */

class Variant {
    #rules;

    /**
     * Verify that the given variant is a valid VariantInterface
     * @param {unknown} variant 
     * @param {string} [varName = 'variant'] 
     * @returns {VariantInterface}
     */
    static verifyInterface(variant, varName = 'variant') {
        if (!Array.isArray(variant))
            throw new TypeError(`Expected ${varName} to be an Array`);

        variant.forEach((rule, index) => {
            Rule.verifyInterface(rule, `${varName}[${index}]`);
        });

        return variant;
    }

    /**
     * Create a new Variant Instance from a VariantInterface
     * @param {VariantInterface} variant 
     * @param {string} [varName = 'variant'] 
     * @returns {Variant}
     */
    static fromJSON(variant, varName = 'variant') {
        if (typeof varName !== 'string')
            throw new TypeError('Expected path to be a string');

        if (!Array.isArray(variant))
            throw new TypeError(`Expected ${varName} to be an Array`);

        return new Variant(variant.map((rule, index) => Rule.fromJSON(rule, `${varName}[${index}]`)));
    }

    /**
     * Create a new Variant Instance
     * @param {Rule[]} [rules = []] 
     */
    constructor(rules = []) {
        if (!Array.isArray(rules))
            throw new TypeError('Expected rules to be an Array');

        rules.forEach((rule, index) => {
            if (!(rule instanceof Rule))
                throw new TypeError(`Expected rules[${index}] to be an instance of Rule`);
        });

        this.#rules = rules;
    }

    /**
     * Add a Rule to this Variant
     * @param {Rule} rule 
     * @returns {Variant}
     */
    addRule(rule) {
        if (!(rule instanceof Rule))
            throw new TypeError('Expected rule to be an instance of Rule');

        this.#rules.push(rule);

        return this;
    }

    /**
     * Get the Rules of this Variant
     * @returns {Rule[]}
     */
    getRules() {
        return this.#rules;
    }

    /**
     * Clear the Rules of this Variant
     */
    clearRules() {
        this.#rules = [];
    }

    /**
     * Parse the give source
     * @param {string} source 
     * @param {Node | null} precedingNode 
     * @param {Grammar} grammarContext 
     * @returns {Node}
     */
    parse(source, precedingNode, grammarContext) {
        if (typeof source !== 'string')
            throw new TypeError('Expected source to be a string');

        if (!(precedingNode instanceof Node) && (precedingNode !== null))
            throw new TypeError('Expected precedingNode to be an instance of Node or null');

        if (!(grammarContext instanceof Grammar))
            throw new TypeError('Expected grammarContext to be an instance of Grammar');

        for (const rule of this.#rules) {
            try {
                return rule.parse(source, precedingNode, grammarContext);
            }
            catch (error) { }
        }

        throw new VariantError('No Rule matched', precedingNode ? precedingNode.range[1] + 1 : 0);
    }

    /**
     * Convert this Variant to a VariantInterface
     * @returns {VariantInterface}
     */
    toJSON() {
        return this.#rules.map(rule => rule.toJSON());
    }
}

module.exports = { Variant };