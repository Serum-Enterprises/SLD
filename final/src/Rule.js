const Component = require('./Component');
const Node = require('../lib/Node');
const Parser = require('./Parser');
const AutoThrowError = require('../lib/errors/AutoThrowError');

class Rule {
    #components;
    #autoThrow;
    #autoRecover;

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

    get components() {
        return this.#components;
    }

    get autoThrow() {
        return this.#autoThrow;
    }

    get autoRecover() {
        return this.#autoRecover;
    }

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

    toJSON() {
        return {
            components: this.#components.map(component => component.toJSON()),
            autoThrow: this.#autoThrow,
            autoRecover: this.#autoRecover ? this.#autoRecover.toJSON() : null
        };
    }

    static verify(data, varName = 'data') {
        if (Object.prototype.toString.call(data) !== '[object Object]')
            throw new TypeError(`Expected ${varName} to be an Object`);

        if (!Array.isArray(data.components))
            throw new TypeError(`Expected ${varName}.components to be an Array`);

        data.components.forEach((component, index) => Component.Component.verify(component, `${varName}.components[${index}]`));

        if (data.autoThrow !== null && typeof data.autoThrow !== 'string')
            throw new TypeError(`Expected ${varName}.autoThrow to be a String or null`);

        if (data.autoRecover !== null)
            Component.Component.verify(data.autoRecover, `${varName}.autoRecover`);

        return data;
    }

    static fromJSON(data) {
        return new Rule(
            data.components.map((component) => Component.Component.fromJSON(component)),
            data.autoThrow,
            data.autoRecover ? Component.Component.fromJSON(data.autoRecover) : null
        );
    }
}

module.exports = { Rule };