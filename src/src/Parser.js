const Variant = require('./Variant');

/**
 * @typedef {{rootVariant: Variant.VariantInterface, variants: {[name: string]: Variant.VariantInterface}}} ParserInterface
 */

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

    /**
     * Verify if the given parser is a valid ParserInterface
     * @param {unknown} parser 
     * @param {string} varName 
     * @returns {ParserInterface}
     */
    static verifyInterface(parser, varName = 'parser') {
        if (Object.prototype.toString.call(parser) !== '[object Object]')
            throw new TypeError(`Expected ${varName} to be an Object`);

        Variant.verifyInterface(parser.rootVariant, `${varName}.rootVariant`);

        if (Object.prototype.toString.call(parser.variants) !== '[object Object]')
            throw new TypeError(`Expected ${varName}.variants to be an Object`);

        Object.entries(parser.variants).forEach(([key, value]) => Variant.verifyInterface(value, `${varName}.variants[${key}]`));

        return parser;
    }

    toJSON() {
        return {
            rootVariant: this.#rootVariant.toJSON(),
            variants: Array.from(this.#variants.entries()).reduce((acc, [key, value]) => {
                return { ...acc, [key]: value.toJSON() }
            }, {})
        };
    }

    static fromJSON(json, path = 'json', safe = true) {
        if (typeof path !== 'string')
            throw new TypeError('Expected path to be a string');

        if (typeof safe !== 'boolean')
            throw new TypeError('Expected safe to be a boolean');

        if (safe)
            Parser.verifyInterface(json, path);

        return new Parser(
            Variant.Variant.fromJSON(json.rootVariant, `${path}.rootVariant`, false),
            Object.entries(json.variants).reduce((acc, [key, value]) => {
                return acc.set(key, Variant.Variant.fromJSON(value, `${path}.variants[${key}]`, false));
            }, new Map())
        );
    }
}

module.exports = { Parser };