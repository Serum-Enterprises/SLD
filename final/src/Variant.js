const Rule = require('./Rule');

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
        for (const rule of this.#rules) {
            try {
                return rule.execute(input, precedingNode, parentParser);
            }
            catch (error) { }
        }

        throw new VariantError('No Rule matched', precedingNode ? precedingNode.range[1] + 1 : 0);
    }

    toJSON() {
        return {
            rules: this.#rules.map(rule => rule.toJSON())
        };
    }

    static verifyInterface(data, varName = 'data') {
        if (Object.prototype.toString.call(data) !== '[object Object]')
            throw new TypeError(`Expected ${varName} to be an Object`);

        if (!Array.isArray(data.rules))
            throw new TypeError(`Expected ${varName}.rules to be an Array`);

        data.rules.forEach((rule, index) => Rule.Rule.verifyInterface(rule, `${varName}.rule[${index}]`));
        
        return data;
    }

    static fromJSON(data) {
        return new Variant(data.rules.map((rule) => Rule.Rule.fromJSON(rule)));
    }
}

module.exports = { Variant };