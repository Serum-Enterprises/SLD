const { Node } = require('../lib/Node');
const { Variant } = require('./Variant');

/**
 * @typedef {{[key: string]: Variant.VariantInterface}} GrammarInterface
 */

class Grammar {
    #variants;

    /**
     * Verify that the given grammar is a valid GrammarInterface
     * @param {unknown} grammar 
     * @param {string} [varName = 'grammar'] 
     * @returns {GrammarInterface}
     */
    static verifyInterface(grammar, varName = 'grammar') {
        if (typeof varName !== 'string')
            throw new TypeError('Expected varName to be a String');

        if (Object.prototype.toString.call(grammar) !== '[object Object]')
            throw new TypeError(`Expected ${varName} to be an Object`);

        Object.entries(grammar).forEach(([key, value]) => {
            Variant.verifyInterface(value, `${varName}.${key}`);
        });

        return grammar;
    }

    /**
     * Create a new Grammar Instance from a GrammarInterface
     * @param {GrammarInterface} grammar 
     * @param {string} [varName = 'grammar'] 
     * @returns {Grammar}
     */
    static fromJSON(grammar, varName = 'grammar') {
        if (typeof varName !== 'string')
            throw new TypeError('Expected varName to be a String');

        if (Object.prototype.toString.call(grammar) !== '[object Object]')
            throw new TypeError(`Expected ${varName} to be an Object`);

        return new Grammar(Object.entries(grammar).reduce((result, [key, value]) => {
            return {
                ...result,
                [key]: Variant.fromJSON(value, `${varName}.${key}`)
            }
        }, {}));
    }

    /**
     * Create a new Grammar Instance
     * @param {{ [key: string]: Variant }} [variants = {}]
     */
    constructor(variants = {}) {
        if (Object.prototype.toString.call(variants) !== '[object Object]')
            throw new TypeError('Expected variants to be a GrammarInterface');

        Object.entries(variants).forEach(([key, value]) => {
            if (!(value instanceof Variant))
                throw new TypeError(`Expected variants[${key}] to be an instance of Variant`);
        });

        this.#variants = variants;
    }

    /**
     * Get a Variant
     * @param {string} name
     * @returns {Variant | undefined}
     */
    getVariant(name) {
        if (typeof name !== 'string')
            throw new TypeError('Expected name to be a String');

        return this.#variants[name];
    }

    /**
     * Set a Variant
     * @param {string} name 
     * @param {Variant} variant 
     * @returns {Grammar}
     */
    setVariant(name, variant) {
        if (typeof name !== 'string')
            throw new TypeError('Expected name to be a String');

        if (!(variant instanceof Variant))
            throw new TypeError('Expected variant to be an instance of Variant');

        if (this.hasVariant(name))
            throw new ReferenceError(`Variant ${name} already exists`);

        this.#variants[name] = variant;
        return this;
    }

    /**
     * Check if a Variant exists
     * @param {string} name 
     * @returns {boolean}
     */
    hasVariant(name) {
        if (typeof name !== 'string')
            throw new TypeError('Expected name to be a String');

        return this.#variants[name] instanceof Variant;
    }

    /**
     * Delete a Variant
     * @param {string} name 
     * @returns {boolean}
     */
    deleteVariant(name) {
        if (typeof name !== 'string')
            throw new TypeError('Expected name to be a String');

        if (!this.hasVariant(name))
            return false;

        return delete this.#variants[name];
    }

    /**
     * Delete all Variants
     * @returns {void}
     */
    clearVariants() {
        this.#variants = {};
    }

    /**
     * Parse the given source using the given rootVariant
     * @param {string} source 
     * @param {string} rootVariant 
     * @returns {Node}
     */
    parse(source, rootVariant) {
        if (typeof source !== 'string')
            throw new TypeError('Expected source to be a String');

        if (typeof rootVariant !== 'string')
            throw new TypeError('Expected rootVariant to be a String');

        if (!this.hasVariant(rootVariant))
            throw new ReferenceError('Expected rootVariant to be an existing Variant');

        return this.#variants[rootVariant].parse(source, null, this);
    }

    /**
     * Convert this Grammar to a GrammarInterface
     * @returns {GrammarInterface}
     */
    toJSON() {
        return Object.entries(this.#variants).reduce((result, [key, value]) => {
            return { ...result, [key]: value.toJSON() };
        }, {});
    }
}

module.exports = { Grammar };