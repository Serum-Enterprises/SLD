const { Variant } = require('./Variant');

export class Grammar {
    #variants;

    constructor(variants = new Map()) {
        if (!((variants instanceof Map) && Array.from(variants.entries()).every(([key, value]) => (typeof key === 'string') && (value instanceof Variant))))
            throw new TypeError('Expected variants to be a Map of Strings and Variant Instances');

        this.#variants = variants;
    }

    get variants() {
        return this.#variants;
    }

    execute(input, rootVariant) {
        if (typeof input !== 'string')
            throw new TypeError('Expected input to be a String');

        if (typeof rootVariant !== 'string')
            throw new TypeError('Expected rootVariant to be a String');

        if (!this.#variants.has(rootVariant))
            throw new ReferenceError('Expected rootVariant to be an existing Variant');

        return this.#variants.get(rootVariant).execute(input, null, this);
    }

    static verifyInterface(grammar, varName = 'grammar') {
        if (Object.prototype.toString.call(grammar) !== '[object Object]')
            throw new TypeError(`Expected ${varName} to be an Object`);

        if (Object.prototype.toString.call(grammar.variants) !== '[object Object]')
            throw new TypeError(`Expected ${varName}.variants to be an Object`);

        Object.entries(grammar.variants).forEach(([key, value]) => Variant.verifyInterface(value, `${varName}.variants[${key}]`));

        return grammar;
    }

    toJSON() {
        return {
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
            Grammar.verifyInterface(json, path);

        return new Grammar(
            Object.entries(json.variants).reduce((acc, [key, value]) => {
                return acc.set(key, Variant.fromJSON(value, `${path}.variants[${key}]`, false));
            }, new Map())
        );
    }
}

module.exports = { Grammar };