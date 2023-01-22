const Result = require('./lib/Result/Result.class');
const Node = Result.Node;
const Debug = require('./lib/Debug.class');
const debug = new Debug('Parser');

class ParserError extends Error { }
class LookupError extends ParserError { }

/**
 * @type {(input: string, precedingNode: Node | null, parserContext: Parser) => Result | null} matchFunction
 */

class Component {
    /**
     * @type {matchFunction}
     */
    #matchFunction;
    /**
     * @type {string | null}
     */
    #varName;

    /**
     * Create a new Component based on the given matchFunction and varName.
     * @param {matchFunction} matchFunction 
     * @param {string | null} varName 
     */
    constructor(matchFunction, varName = null) {
        if (typeof matchFunction !== 'function')
            throw new TypeError('Expected matchFunction to be a Function');

        if (varName !== null && typeof varName !== 'string')
            throw new TypeError('Expected varName to be a String or null');

        this.#matchFunction = matchFunction;
        this.#varName = varName;
    }

    /**
     * @returns {matchFunction}
     */
    get matchFunction() {
        return this.#matchFunction;
    }

    /**
     * @returns {string | null}
     */
    get varName() {
        return this.#varName;
    }

    /**
     * Factory method to create a new Component that matches a string.
     * @param {string} string 
     * @param {string | null} varName 
     * @returns {Component}
     */
    static matchString(string, varName = null) {
        if (typeof string !== 'string')
            throw new TypeError('Expected string to be a String');

        if (varName !== null && typeof varName !== 'string')
            throw new TypeError('Expected varName to be a String or null');

        // Debug
        {
            debug.extend('Component').log(`Creating a matchString Component for "${string}"`);
        }

        return new Component((input, precedingNode, parserContext) => {
            if (typeof input !== 'string')
                throw new TypeError('Expected input to be a String');

            if (precedingNode !== null && !(precedingNode instanceof Node))
                throw new TypeError('Expected precedingNode to be a Node or null');

            if (!(parserContext instanceof Parser))
                throw new TypeError('Expected parserContext to be a Parser');

            if (!input.startsWith(string))
                return null;

            if (precedingNode === null)
                return new Result(Node.createNode(string, string), input.slice(string.length));

            return new Result(precedingNode.calculateNode(string, string), input.slice(string.length));
        }, varName);
    }

    /**
     * Factory method to create a new Component that matches a regular expression.
     * @param {RegExp} regex 
     * @param {string | null} varName 
     * @returns {Component}
     */
    static matchRegex(regex, varName = null) {
        if (!(regex instanceof RegExp))
            throw new TypeError('Expected regex to be a RegExp');

        if (varName !== null && typeof varName !== 'string')
            throw new TypeError('Expected varName to be a String or null');

        // Debug
        {
            debug.extend('Component').log(`Creating a matchRegex Component for "${regex}"`);
        }

        return new Component((input, precedingNode, parserContext) => {
            if (typeof input !== 'string')
                throw new TypeError('Expected input to be a String');

            if (precedingNode !== null && !(precedingNode instanceof Node))
                throw new TypeError('Expected precedingNode to be a Node or null');

            if (!(parserContext instanceof Parser))
                throw new TypeError('Expected parserContext to be a Parser');

            const match = input.match(regex);

            if (match === null)
                return null;

            console.log(match[0]);

            if (precedingNode === null)
                return new Result(Node.createNode(match[0], match[0]), input.slice(match[0].length));

            return new Result(precedingNode.calculateNode(match[0], match[0]), input.slice(match[0].length));
        }, varName);
    }

    /**
     * Factory method to create a new Component that matches Whitespaces (/^\s+/)
     * @param {string | null} varName 
     * @returns {Component}
     */
    static matchWhitespace(varName = null) {
        return Component.matchRegex(/^\s*/, varName);
    }

    /**
     * Factory method to create a new Component that matches a RuleSet.
     * @param {string} ruleSetName 
     * @param {string} varName 
     * @returns {Component}
     */
    static matchRuleSet(ruleSetName, varName = null) {
        if (typeof ruleSetName !== 'string')
            throw new TypeError('Expected ruleSetName to be a String');

        if (varName !== null && typeof varName !== 'string')
            throw new TypeError('Expected varName to be a String or null');

        // Debug
        {
            debug.extend('Component').log(`Creating a matchRuleSet Component for "${ruleSetName}"`);
        }

        return new Component((input, precedingNode, parserContext) => {
            if (typeof input !== 'string')
                throw new TypeError('Expected input to be a String');

            if (precedingNode !== null && !(precedingNode instanceof Node))
                throw new TypeError('Expected precedingNode to be a Node or null');

            if (!(parserContext instanceof Parser))
                throw new TypeError('Expected parserContext to be a Parser');

            const ruleSet = parserContext.get(ruleSetName);

            if (!ruleSet)
                throw new LookupError(`RuleSet ${ruleSetName} not found.`);

            return ruleSet.execute(input, precedingNode, parserContext);
        }, varName);
    }
}

class Rule extends Array {
    /**
     * @type {(() => unknown) | null}
     */
    #handler;

    /**
     * Create a new Rule.
     * @param {Array<Component>} components 
     * @param {(() => unknown) | null} handler 
     */
    constructor(components = [], handler = null) {
        if (!Array.isArray(components) && !components.every(component => component instanceof Component))
            throw new TypeError('Expected components to be an Array of Components');

        if (handler !== null && typeof handler !== 'function')
            throw new TypeError('Expected handler to be a Function or null');

        super(...components);
        this.#handler = handler;
    }

    /**
     * Begin a new Rule.
     * @param {Component} component 
     * @returns {Rule}
     */
    static begin(component) {
        if (!(component instanceof Component))
            throw new TypeError('Expected component to be an instance of Component');

        return new Rule([component]);
    }
    /**
     * Add a new Component to the Rule with a Whitespace Component in between.
     * @param {Component} component 
     * @returns {Rule}
     */
    followedBy(component) {
        if (!(component instanceof Component))
            throw new TypeError('Expected component to be an instance of Component');

        this.push(Component.matchWhitespace());
        this.push(component);

        return this;
    }

    /**
     * Add a new Component to the Rule without a Whitespace Component in between.
     * @param {Component} component 
     * @returns {Rule}
     */
    directyFollowedBy(component) {
        if (!(component instanceof Component))
            throw new TypeError('Expected component to be an instance of Component');

        this.push(component);

        return this;
    }
    /**
     * Add a Handler to the Rule.
     * @param {() => unknown)} handler 
     * @returns {Rule}
     */
    end(handler) {
        if (typeof handler !== 'function')
            throw new TypeError('Expected handler to be a Function');

        this.#handler = handler;

        return this;
    }
    /**
     * Add a throwing Handler to the Rule
     * @param {string} message 
     * @returns {Rule}
     */
    throw(message) {
        if (typeof message !== 'string')
            throw new TypeError('Expected message to be a String');

        this.#handler = () => {
            throw new ParserError(message);
        };

        return this;
    }
    /**
     * Execute the Rule.
     * @param {string} input 
     * @param {Node} precedingNode 
     * @param {Parser} parserContext 
     * @returns {Result | null}
     */
    execute(input, precedingNode, parserContext) {
        if (typeof input !== 'string')
            throw new TypeError('Expected input to be a String');

        if (precedingNode !== null && !(precedingNode instanceof Node))
            throw new TypeError('Expected precedingNode to be a Node or null');

        if (!(parserContext instanceof Parser))
            throw new TypeError('Expected parserContext to be a Parser');

        let rest = input;
        let results = [];
        let varData = {};
        let currentNode = precedingNode;

        for (const component of this) {
            const result = component.matchFunction(rest, currentNode, parserContext);

            if (result === null)
                return null;

            if (component.varName !== null)
                varData[component.varName] = result.node;

            results.push(result.node);
            rest = result.rest;
        }

        const handlerResult = this.#handler ? this.#handler.bind(varData)() : varData;

        if (precedingNode === null)
            return new Result(Node.createNode(handlerResult, results.map(node => node.raw).join('')), rest);

        return new Result(precedingNode.calculateNode(handlerResult, results.map(node => node.raw).join('')), rest);
    }
}

class RuleSet extends Array {
    /**
     * Create a new RuleSet.
     * @param {Array<Rule>} rules 
     */
    constructor(rules) {
        if (!Array.isArray(rules) && !rules.every(rule => rule instanceof Rule))
            throw new TypeError('Expected rules to be an Array of Rules');

        super(...rules);

        // Debug
        {
            debug.extend('RuleSet').log(`Created RuleSet with ${rules.length} Rule${rules.length > 1 ? 's' : ''}:`);

            this.forEach((rule, index) => {
                debug.extend('RuleSet').log(`Rule ${index + 1} with ${rule.length} Component${rule.length > 1 ? 's' : ''}`);
            });
        }
    }

    /**
     * Execute the RuleSet.
     * @param {string} input 
     * @param {Node | null} precedingNode 
     * @param {Parser} parserContext 
     * @returns {Result | null}
     */
    execute(input, precedingNode, parserContext) {
        if (typeof input !== 'string')
            throw new TypeError('Expected input to be a String');

        if (precedingNode !== null && !(precedingNode instanceof Node))
            throw new TypeError('Expected precedingNode to be a Node or null');

        if (!(parserContext instanceof Parser))
            throw new TypeError('Expected parserContext to be a Parser');

        // Find this in Parser
        Array.from(parserContext.entries()).forEach(([name, ruleSet]) => {
            if (ruleSet === this)
                debug.extend('RuleSet').log(`Executing RuleSet ${name}`);
        });

        for (const rule of this) {
            const result = rule.execute(input, precedingNode, parserContext);

            if (result !== null)
                return result;
        }

        throw new ParserError('No rule matched');
    }
}

class Parser extends Map {
    /**
     * @type {RuleSet}
     */
    #rootRuleSet;

    /**
     * Create a new Parser.
     * @param {RuleSet} rootRuleSet 
     * @param {Array<RuleSet>} ruleSets 
     */
    constructor(rootRuleSet, ruleSets = []) {
        if (!(rootRuleSet instanceof RuleSet))
            throw new TypeError('Expected rootRuleSet to be an instance of RuleSet');

        if (!(Array.isArray(ruleSets) && ruleSets.every(([name, ruleSet]) => typeof name === 'string' && ruleSet instanceof RuleSet)))
            throw new TypeError('Expected ruleSets to be an Array of RuleSets');
        
        // Debug
        {
            debug.log(`Created Parser with ${ruleSets.length} RuleSet${ruleSets.length > 1 ? 's' : ''}:`);

            for (const [name, ruleSet] of ruleSets)
                debug.log(`RuleSet ${name} with ${ruleSet.length} Rule${ruleSet.length > 1 ? 's' : ''}`)
        }
        super(ruleSets);
        this.#rootRuleSet = rootRuleSet;
    }

    /**
     * Execute the Parser.
     * @param {string} input 
     * @returns {Node}
     */
    execute(input) {
        if (typeof input !== 'string')
            throw new TypeError('Expected input to be a String');

        debug.extend('EXEC').log(`Executing rootRuleSet with ${input}`);

        const result = this.#rootRuleSet.execute(input, null, this);

        if (result === null)
            return null;

        return result.node;
    }
}

module.exports = {
    Parser,
    RuleSet,
    Rule,
    Component
}