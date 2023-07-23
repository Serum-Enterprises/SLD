const Node = require('./lib/Node');
const Debug = require('./lib/Debug');

const MisMatchError = require('./lib/errors/MisMatchError');
const AutoThrowError = require('./lib/errors/AutoThrowError');
const VariantError = require('./lib/errors/VariantError');

class Parser {
    #debug;
    #grammar;

    static #verifyComponent(component, varName = 'component') {
        if (Object.prototype.toString.call(component) !== '[object Object]')
            throw new TypeError(`Expected ${varName} to be an Object`);

        if (typeof component.type !== 'string')
            throw new TypeError(`Expected ${varName}.type to be a String`);

        if (!['STRING', 'REGEXP', 'VARIANT'].includes(component.type))
            throw new TypeError(`Expected ${varName}.type to be 'STRING', 'REGEXP' or 'VARIANT'`);

        if (typeof component.value !== 'string')
            throw new TypeError(`Expected ${varName}.value to be a String`);

        if (typeof component.name !== 'string' && component.name !== null)
            throw new TypeError(`Expected ${varName}.name to be a String or null`);

        if (typeof component.greedy !== 'boolean')
            throw new TypeError(`Expected ${varName}.greedy to be a Boolean`);

        if (typeof component.optional !== 'boolean')
            throw new TypeError(`Expected ${varName}.optional to be a Boolean`);
    }

    static #verifyRule(variantNames, rule, varName = 'rule') {
        if (Object.prototype.toString.call(rule) !== '[object Object]')
            throw new TypeError(`Expected ${varName} to be an Object`);

        if (!Array.isArray(rule.components))
            throw new TypeError(`Expected ${varName}.components to be an Array`);

        rule.components.forEach((component, i) => {
            Parser.#verifyComponent(component, `${varName}.components[${i}]`);

            if (component.type === 'VARIANT' && !variantNames.includes(component.value))
                throw new TypeError(`Expected ${varName}.components[${i}].value to be a valid Variant Name`);
        });

        if (typeof rule.throwMessage !== 'string' && rule.throwMessage !== null)
            throw new TypeError(`Expected ${varName}.throwMessage to be a String or null`);

        if (rule.recoverComponent !== null) {
            Parser.#verifyComponent(rule.recoverComponent, `${varName}.recoverComponent`);

            if (rule.recoverComponent.type === 'VARIANT' && !variantNames.includes(rule.recoverComponent.value))
                throw new TypeError(`Expected ${varName}.recoverComponent.value to be a valid Variant Name`);
        }
    }

    static #verifyVariant(variantNames, variant, varName = 'variant') {
        if (!Array.isArray(variant))
            throw new TypeError(`Expected ${varName} to be an Array`);

        variant.forEach((rule, index) => {
            Parser.#verifyRule(variantNames, rule, `${varName}[${index}]`);
        });
    }

    static #verify(grammar) {
        if (Object.prototype.toString.call(grammar) !== '[object Object]')
            throw new TypeError('Expected grammar to be an Object');

        const variantNames = Object.keys(grammar);

        Object.entries(grammar).forEach(([name, variant]) => {
            Parser.#verifyVariant(variantNames, variant, `grammar.${name}.`);
        });
    }

    constructor(grammar) {
        Parser.#verify(grammar);

        this.#grammar = grammar;
    }

    #createMatchFunction(component) {
        switch (component.type) {
            case 'STRING':
                return (source, precedingNode) => {
                    if (!source.startsWith(component.value))
                        throw new MisMatchError(`Expected ${component.value}`, precedingNode ? precedingNode.range[1] + 1 : 0);

                    if (precedingNode)
                        return new Node('MATCH', component.value, {}, [
                            precedingNode.range[1] + 1,
                            precedingNode.range[1] + component.value.length
                        ]);

                    return new Node('MATCH', component.value, {}, [0, component.value.length - 1]);
                };
            case 'REGEXP':
                return (source, precedingNode) => {
                    const match = source.match(new RegExp(component.value));
                    if (!match)
                        throw new MisMatchError(`Expected /${component.value}/`, precedingNode ? precedingNode.range[1] + 1 : 0);

                    if (precedingNode)
                        return new Node('MATCH', match[0], {}, [
                            precedingNode.range[1] + 1,
                            precedingNode.range[1] + match[0].length
                        ]);

                    return new Node('MATCH', match[0], {}, [0, match[0].length - 1]);
                };
            case 'VARIANT':
                return (source, precedingNode) => {
                    if (!this.#grammar[component.value])
                        throw new Error(`Expected Variant ${component.value} to be defined`);

                    const variant = this.#grammar[component.value];

                    Debug.create('Parser:parseVariant').log(`Matching Variant ${component.value}`);

                    return this.#parseVariant(variant, source, precedingNode);
                };
        }
    }

    #parseRule(rule, source, precedingNode) {
        let rest = source;
        let nodes = [];
        let namedNodes = {};
        let currentPrecedingNode = precedingNode;

        if (rule.autoThrow)
            throw new AutoThrowError(rule.autoThrow, precedingNode ? precedingNode.range[1] + 1 : 0);

        try {
            for (let component of rule.components) {
                Debug.create('Parser:parseRule').log(`Created matchFunction for Component ${JSON.stringify(component)}`);

                const matchFunction = this.#createMatchFunction(component);

                try {
                    let result = matchFunction(rest, currentPrecedingNode);

                    if (component.name !== null)
                        namedNodes[component.name] = result;

                    nodes.push(result);
                    rest = rest.slice(result.raw.length);
                    currentPrecedingNode = result;

                    if (component.greedy) {
                        let didThrow = false;

                        while (!didThrow) {
                            try {
                                result = matchFunction(rest, currentPrecedingNode);

                                if (component.name) {
                                    if (!Array.isArray(namedNodes[component.name]))
                                        namedNodes[component.name] = [namedNodes[component.name], result];
                                    else
                                        namedNodes[component.name].push(result);
                                }

                                nodes.push(result);
                                rest = rest.slice(result.raw.length);
                                currentPrecedingNode = result;
                            }
                            catch (error) {
                                didThrow = true;
                            }
                        }
                    }
                }
                catch (error) {
                    Debug.create('Parser:parseRule').error(`Error while matching Component ${JSON.stringify(component)}`);
                    Debug.create('Parser:parseRule').error(error.toString());

                    if (component.optional) {
                        Debug.create('Parser:parseRule').warn(`Component ${JSON.stringify(component)} is optional, continuing`);

                        continue;
                    }

                    throw error;
                }
            }
        }
        catch (error) {
            Debug.create('Parser:parseRule').error(`Error while parsing Rule`);
            Debug.create('Parser:parseRule').error(error.toString());

            if (rule.autoRecover) {
                const recoverNode = rule.autoRecover.matchFunction(source, precedingNode, grammarContext);

                Debug.create('Parser:parseRule').warn(`Recovered with Node ${JSON.stringify(recoverNode)}`);

                return new Node('RECOVER', recoverNode.raw, recoverNode.namedNodes, recoverNode.range);
            }

            throw error;
        }

        const raw = source.slice(0, source.length - rest.length);

        return new Node('MATCH', raw, namedNodes, [
            precedingNode ? precedingNode.range[1] + 1 : 0,
            precedingNode ? precedingNode.range[1] + raw.length : (raw.length - 1)
        ]);
    }

    #parseVariant(variant, source, precedingNode) {
        for (let i = 0; i < variant.length; i++) {
            try {
                Debug.create('Parser:parseVariant').log(`Parsing Rule ${i}`);

                return this.#parseRule(variant[i], source, precedingNode);
            }
            catch (error) {
                Debug.create('Parser:parseVariant').error(error.toString());

                if (!(error instanceof MisMatchError) && !(error instanceof AutoThrowError))
                    throw error;
            }
        }

        throw new VariantError('No Rule matched', precedingNode ? precedingNode.range[1] + 1 : 0);
    }

    parse(source, rootVariant = 'grammar') {
        if (typeof source !== 'string')
            throw new TypeError('Expected source to be a String');

        if (typeof rootVariant !== 'string')
            throw new TypeError('Expected rootVariant to be a String');

        if (!this.#grammar[rootVariant])
            throw new ReferenceError(`Expected rootVariant to be a valid Variant Name`);

        const rootVariantRule = this.#grammar[rootVariant];

        Debug.create('Parser:parse').log(`Parsing source with Root Variant ${rootVariant}`);

        return this.#parseVariant(rootVariantRule, source, null);
    }
}

module.exports = { Parser, Node, MisMatchError, VariantError, AutoThrowError };