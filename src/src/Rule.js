const Component = require('./Component');
const Parser = require('./Parser');

const Node = require('../lib/Node');
const AutoThrowError = require('../lib/errors/AutoThrowError');

class Rule {
    /**
     * @type {Component.Component[]}
     */
    #components;
    /**
     * @type {string | null}
     */
    #autoThrow;
    /**
     * @type {Component.Component | null}
     */
    #autoRecover;

    /**
     * Create a new Rule Instance
     * @param {Component.Component[]} components 
     * @param {string | null} autoThrow 
     * @param {Component.Component | null} autoRecover
     * @throws {TypeError} if components is not an Array of Component Instances
     * @throws {TypeError} if autoThrow is not a String or null
     * @throws {TypeError} if autoRecover is not an instance of Component or null
     */
    constructor(components, autoThrow = null, autoRecover = null) {
        if (!(Array.isArray(components) && components.every(component => component instanceof Component.Component)))
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
     * @returns {Component.Component[]}
     */
    get components() {
        return this.#components;
    }

    /**
     * @returns {string | null}
     */
    get autoThrow() {
        return this.#autoThrow;
    }

    /**
     * @returns {Component.Component | null}
     */
    get autoRecover() {
        return this.#autoRecover;
    }

    /**
     * Executes the Rule on a source String with an optionally preceding Node and a Parser Context
     * @param {string} input 
     * @param {Node.Node | null} precedingNode 
     * @param {Parser} parentParser 
     * @returns {unknown}
     * @throws {TypeError} if input is not a String
     * @throws {TypeError} if precedingNode is not an instance of Node or null
     * @throws {TypeError} if parentParser is not an instance of Parser
     * @throws {AutoThrowError} if autoThrow is not null
     * 
     */
    execute(input, precedingNode, parentParser) {
        if (typeof input !== 'string')
            throw new TypeError('Expected input to be a String');

        if (!(precedingNode instanceof Node.Node || precedingNode === null))
            throw new TypeError('Expected precedingNode to be an instance of Node or null');

        if (!(parentParser instanceof Parser))
            throw new TypeError('Expected parentParser to be an instance of Parser');

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
                    let result = matchFunction(rest, currentPrecedingNode, parentParser);

                    if (component.name)
                        namedNodes[component.name] = result;

                    nodes.push(result);
                    rest = rest.slice(result.raw.length);
                    currentPrecedingNode = result;

                    if (component.greedy) {
                        let didThrow = false;

                        while (!didThrow) {
                            try {
                                result = matchFunction(rest, currentPrecedingNode, parentParser);

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
            if (this.#autoRecover)
                return this.#autoRecover.matchFunction(input, precedingNode, parentParser);

            throw error;
        }

        const raw = input.slice(0, input.length - rest.length);

        return new Node.Node(Node.TYPE.MATCH, raw, namedNodes, [
            precedingNode ? precedingNode.range[1] + 1 : 0,
            precedingNode ? precedingNode.range[1] + raw.length : raw.length
        ]);
    }
}

module.exports = { Rule };