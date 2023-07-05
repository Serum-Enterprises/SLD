const { Component } = require('./Component');
const { Grammar } = require('./Parser');

const { Node } = require('../lib/Node');
const { AutoThrowError } = require('../lib/errors/AutoThrowError');

class Rule {
    #components;
    #autoThrow;
    #autoRecover;

    constructor(components, autoThrow = null, autoRecover = null) {
        if (!(Array.isArray(components) && components.every(component => component instanceof Component)))
            throw new TypeError('Expected components to be an Array of Component Instances');

        if (!(typeof autoThrow === 'string' || autoThrow === null))
            throw new TypeError('Expected autoThrow to be a String or null');

        if (!(autoRecover instanceof Rule || autoRecover === null))
            throw new TypeError('Expected autoRecover to be an instance of Rule or null');

        this.#components = components;
        this.#autoThrow = autoThrow;
        this.#autoRecover = autoRecover;
    }

    get components() {
        return this.#components;
    }

    get autoThrow() {
        return this.#autoThrow;
    }

    get autoRecover() {
        return this.#autoRecover;
    }

    execute(input, precedingNode, grammarContext) {
        if (typeof input !== 'string')
            throw new TypeError('Expected input to be a String');

        if (!(precedingNode instanceof Node || precedingNode === null))
            throw new TypeError('Expected precedingNode to be an instance of Node or null');

        if (!(grammarContext instanceof Grammar))
            throw new TypeError('Expected grammarContext to be an instance of Parser');

        let rest = input;
        let nodes = [];
        let namedNodes = {};
        let currentPrecedingNode = precedingNode;

        if (this.#autoThrow)
            throw new AutoThrowError(this.#autoThrow, precedingNode ? precedingNode.range[1] + 1 : 0);

        try {
            for (let component of this.#components) {
                const matchFunction = component.matchFunction;

                try {
                    let result = matchFunction(rest, currentPrecedingNode, grammarContext);

                    if (component.name)
                        namedNodes[component.name] = result;

                    nodes.push(result);
                    rest = rest.slice(result.raw.length);
                    currentPrecedingNode = result;

                    if (component.greedy) {
                        let didThrow = false;

                        while (!didThrow) {
                            try {
                                result = matchFunction(rest, currentPrecedingNode, grammarContext);

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
                    if (component.optional)
                        continue;

                    throw error;
                }
            }
        }
        catch (error) {
            if (this.#autoRecover) {
                const recoverNode = this.#autoRecover.matchFunction(input, precedingNode, grammarContext);

                return new Node('RECOVER', recoverNode.raw, recoverNode.namedNodes, recoverNode.children, recoverNode.range);
            }

            throw error;
        }

        const raw = input.slice(0, input.length - rest.length);

        return new Node('MATCH', raw, namedNodes, [
            precedingNode ? precedingNode.range[1] + 1 : 0,
            precedingNode ? precedingNode.range[1] + raw.length : raw.length
        ]);
    }

    static verifyInterface(rule, varName = 'rule') {
        if (Object.prototype.toString.call(rule) !== '[object Object]')
            throw new TypeError(`Expected ${varName} to be an Object`);

        if (!Array.isArray(rule.components))
            throw new TypeError(`Expected ${varName}.components to be an Array`);

        rule.components.forEach((component, index) => Component.verifyInterface(component, `${varName}.components[${index}]`));

        if (rule.autoThrow !== null && typeof rule.autoThrow !== 'string')
            throw new TypeError(`Expected ${varName}.autoThrow to be a String or null`);

        if (rule.autoRecover !== null)
            Component.verifyInterface(rule.autoRecover, `${varName}.autoRecover`);

        return rule;
    }

    toJSON() {
        return {
            components: this.#components.map(component => component.toJSON()),
            autoThrow: this.#autoThrow,
            autoRecover: this.#autoRecover ? this.#autoRecover.toJSON() : null
        };
    }

    static fromJSON(json, path = 'json', safe = true) {
        if (typeof path !== 'string')
            throw new TypeError('Expected path to be a String');

        if (typeof safe !== 'boolean')
            throw new TypeError('Expected safe to be a Boolean');

        if (safe)
            Rule.verifyInterface(json, path);

        return new Rule(
            json.components.map((component, index) => Component.fromJSON(component, `${path}.components[${index}]`, false)),
            json.autoThrow,
            json.autoRecover ? Component.fromJSON(json.autoRecover, `${path}.autoRecover`, false) : null
        );
    }
}

module.exports = { Rule };