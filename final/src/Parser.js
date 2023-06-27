const Variant = require('./Variant');

export class Parser {
    /**
     * @type {Variant.Variant}
     */
    #rootVariant;
    /**
     * @type {Map<string, Variant.Variant>}
     */
    #variants;

    /**
     * Create a new Parser Instance
     * @param {Variant.Variant} rootVariant 
     * @param {Map<string, Variant.Variant>} variants 
     * @throws {TypeError} if rootVariant is not an instance of Variant
     * @throws {TypeError} if variants is not a Map of Strings and Variant Instances
     */
    constructor(rootVariant, variants) {
        if (!(rootVariant instanceof Variant.Variant))
            throw new TypeError('Expected rootVariant to be an instance of Variant');

        if (!((variants instanceof Map) && Array.from(variants.entries()).every(([key, value]) => (typeof key === 'string') && (value instanceof Variant.Variant))))
            throw new TypeError('Expected variants to be a Map of strings and Variant Instances');

        this.#rootVariant = rootVariant;
        this.#variants = variants;
    }

    /**
     * @returns {Variant.Variant}
     */
    get rootVariant() {
        return this.#rootVariant;
    }

    /**
     * @returns {Map<string, Variant.Variant>}
     */
    get variants() {
        return this.#variants;
    }

    /**
     * Execute the Parser on a source String
     * @param {string} input 
     * @returns {unknown}
     * @throws {TypeError} if input is not a String
     */
    execute(input) {
        if (typeof input !== 'string')
            throw new TypeError('Expected input to be a string');

        return this.#rootVariant.execute(input, null, this);
    }
}

module.exports = { Parser };