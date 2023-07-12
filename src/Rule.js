const { Component } = require('./Component');
const { Grammar } = require('./Grammar');

const { Node } = require('../lib/Node');
const { AutoThrowError } = require('../lib/errors/AutoThrowError');

const { QuantitySelector } = require('./util/QuantitySelector');

/**
 * @typedef {{components: Component.ComponentInterface, autoThrow: string | null, autoRecover: Component.ComponentInterface | null}} RuleInterface
 */

class Rule {
    #components;
    #autoThrow;
    #autoRecover;

    /**
     * Verify that the given rule is a valid RuleInterface
     * @param {unknown} rule 
     * @param {string} [varName = 'rule'] 
     * @returns {RuleInterface}
     */
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

    /**
     * Create a new Rule Instance from a RuleInterface
     * @param {RuleInterface} rule 
     * @param {string} [varName = 'rule'] 
     * @returns {Rule}
     */
    static fromJSON(rule, varName = 'rule') {
        if (typeof varName !== 'string')
            throw new TypeError('Expected path to be a String');

        if (Object.prototype.toString.call(rule) !== '[object Object]')
            throw new TypeError(`Expected ${varName} to be an Object`);

        if (!Array.isArray(rule.components))
            throw new TypeError(`Expected ${varName}.components to be an Array`);

        if (rule.autoThrow !== null && typeof rule.autoThrow !== 'string')
            throw new TypeError(`Expected ${varName}.autoThrow to be a String or null`);

        return new Rule(
            rule.components.map((component, index) => Component.fromJSON(component, `${varName}.components[${index}]`)),
            rule.autoThrow,
            rule.autoRecover !== null ? Component.fromJSON(rule.autoRecover, `${varName}.autoRecover`) : null
        );
    }

    /**
     * Begin a new Rule
     * @returns {QuantitySelector}
     */
    static begin() {
        const rule = new Rule();

        return rule.begin();
    }

    /**
     * Create a new Rule that always throws
     * @param {string} message 
     * @returns {Rule}
     */
    static throw(message) {
        if (typeof message !== 'string')
            throw new TypeError('Expected message to be a String');

        return new Rule().setAutoThrow(message);
    }

    /**
     * Create a new Rule Instance
     * @param {Component[]} [components = []] 
     * @param {string | null} [autoThrow = null] 
     * @param {Component | null} [autoRecover = null] 
     */
    constructor(components = [], autoThrow = null, autoRecover = null) {
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

    /**
     * Set the AutoThrow of this Rule
     * @param {string | null} autoThrow 
     * @returns {Rule}
     */
    setAutoThrow(autoThrow) {
        if (!(typeof autoThrow === 'string' || autoThrow === null))
            throw new TypeError('Expected autoThrow to be a String or null');

        this.#autoThrow = autoThrow;

        return this;
    }

    /**
     * Set the AutoRecover of this Rule
     * @param {Component | null} autoRecover 
     * @returns {Rule}
     */
    setAutoRecover(autoRecover) {
        if (!(autoRecover instanceof Rule || autoRecover === null))
            throw new TypeError('Expected autoRecover to be an instance of Rule or null');

        this.#autoRecover = autoRecover;

        return this;
    }

    /**
     * Add a Component to this Rule
     * @param {Component} component 
     * @returns {Rule}
     */
    addComponent(component) {
        if (!(component instanceof Component))
            throw new TypeError('Expected component to be an instance of Component');

        this.#components.push(component);

        return this;
    }

    /**
     * Begin creating this Rule
     * @returns {QuantitySelector}
     */
    begin() {
        return new QuantitySelector(this);
    }

    /**
     * Add a Component to this Rule with a Whitespace Separator
     * @returns {QuantitySelector}
     */
    followedBy() {
        this.addComponent(new Component('REGEXP', '\s+', null, false, false));

        return new QuantitySelector(this);
    }

    /**
     * Add a Component to this Rule without a Whitespace Separator
     * @returns {QuantitySelector}
     */
    directlyFollowedBy() {
        return new QuantitySelector(this);
    }

    /**
     * Get the Components of this Rule
     * @returns {Component[]}
     */
    getComponents() {
        return this.#components;
    }

    /**
     * Clear the Components of this Rule
     * @returns {Rule}
     */
    clearComponents() {
        this.#components = [];

        return this;
    }

    /**
     * Parse the given source
     * @param {string} source 
     * @param {Node | null} precedingNode 
     * @param {Grammar} grammarContext 
     * @returns {Node}
     */
    parse(source, precedingNode, grammarContext) {
        if (typeof source !== 'string')
            throw new TypeError('Expected source to be a String');

        if (!(precedingNode instanceof Node || precedingNode === null))
            throw new TypeError('Expected precedingNode to be an instance of Node or null');

        if (!(grammarContext instanceof Grammar))
            throw new TypeError('Expected grammarContext to be an instance of Grammar');

        let rest = source;
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
                const recoverNode = this.#autoRecover.matchFunction(source, precedingNode, grammarContext);

                return new Node('RECOVER', recoverNode.raw, recoverNode.namedNodes, recoverNode.children, recoverNode.range);
            }

            throw error;
        }

        const raw = source.slice(0, source.length - rest.length);

        return new Node('MATCH', raw, namedNodes, [
            precedingNode ? precedingNode.range[1] + 1 : 0,
            precedingNode ? precedingNode.range[1] + raw.length : raw.length
        ]);
    }

    /**
     * Convert this Rule to a RuleInterface
     * @returns {RuleInterface}
     */
    toJSON() {
        return {
            components: this.#components.map(component => component.toJSON()),
            autoThrow: this.#autoThrow,
            autoRecover: this.#autoRecover !== null ? this.#autoRecover.toJSON() : null
        };
    }
}

module.exports = { Rule };