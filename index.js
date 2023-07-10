/**
 * @typedef {{type: 'MATCH' | 'RECOVER', raw: string, children: {[key: string]: NodeInterface | NodeInterface[]}, range: [number, number]}} NodeInterface
 * @typedef {{ type: 'STRING' | 'REGEXP' | 'VARIANT', value: string, name: string | null, optional: boolean, greedy: boolean }} ComponentInterface
 * @typedef {{components: ComponentInterface, autoThrow: string | null, autoRecover: ComponentInterface | null}} RuleInterface
 * @typedef {RuleInterface[]} VariantInterface
 * @typedef {{[key: string]: VariantInterface}} GrammarInterface
 */

class AutoThrowError extends Error {
	#index = 0;

	/**
	 * Create a new AutoThrow Error
	 * @param {string} message 
	 * @param {number} index 
	 */
	constructor(message, index) {
		if (typeof message !== 'string')
			throw new TypeError('Expected message to be a String');

		if (!Number.isSafeInteger(index))
			throw new TypeError('Expected index to be an Integer');

		if (index < 0)
			throw new RangeError('Expected index to be greater than or equal to 0');

		super(message);
		this.#index = index;
	}

	/**
	 * Get the Index
	 * @returns {number}
	 */
	get index() {
		return this.#index;
	}
}

class MisMatchError extends Error {
	#index = 0;

	/**
	 * Create a new MisMatch Error
	 * @param {string} message 
	 * @param {number} index 
	 */
	constructor(message, index) {
		if (typeof message !== 'string')
			throw new TypeError('Expected message to be a String');

		if (!Number.isSafeInteger(index))
			throw new TypeError('Expected index to be an Integer');

		if (index < 0)
			throw new RangeError('Expected index to be greater than or equal to 0');

		super(message);
		this.#index = index;
	}

	/**
	 * Get the Index
	 * @returns {number}
	 */
	get index() {
		return this.#index;
	}
}

class VariantError extends Error {
	#index = 0;

	/**
	 * Create a new Variant Error
	 * @param {string} message 
	 * @param {number} index 
	 */
	constructor(message, index) {
		if (typeof message !== 'string')
			throw new TypeError('Expected message to be a String');

		if (!Number.isSafeInteger(index))
			throw new TypeError('Expected index to be an Integer');

		if (index < 0)
			throw new RangeError('Expected index to be greater than or equal to 0');

		super(message);
		this.#index = index;
	}

	/**
	 * Get the Index
	 * @returns {number}
	 */
	get index() {
		return this.#index;
	}
}

class Node {
	#type;
	#raw;
	#children;
	#range;

	/**
	 * Verify that the given node is a valid NodeInterface
	 * @param {unknown} node 
	 * @param {string} [varName = 'node']
	 * @returns {NodeInterface}
	 */
	static verifyInterface(node, varName = 'node') {
		if (typeof varName !== 'string')
			throw new TypeError('Expected varName to be a String');

		if (Object.prototype.toString.call(node) !== '[object Object]')
			throw new TypeError(`Expected ${varName} to be an Object`);

		if (typeof node.type !== 'string')
			throw new TypeError(`Expected ${varName}.type to be a String`);

		if (!['MATCH', 'RECOVER'].includes(node.type.toUpperCase()))
			throw new RangeError(`Expected ${varName}.type to be either "MATCH" or "RECOVER"`);

		if (typeof node.raw !== 'string')
			throw new TypeError(`Expected ${varName}.raw to be a String`);

		if (Object.prototype.toString.call(node.children) !== '[object Object]')
			throw new TypeError('Expected children to be an Object');

		Object.entries(node.children).forEach(([name, child]) => {
			if (Array.isArray(child))
				child.forEach((child, index) => {
					Node.verifyInterface(child, `${varName}.children.${name}[${index}]`);
				});
			else if (Object.prototype.toString.call(child) === '[object Object]')
				Node.verifyInterface(child, `${varName}.children.${name}`);
			else
				throw new TypeError(`Expected ${varName}.children.${name} to be a Node Interface or an Array of Node Interfaces`);
		});

		if (!Array.isArray(node.range))
			throw new TypeError(`Expected ${varName}.range to be an Array`);

		if (node.range.length !== 2)
			throw new RangeError(`Expected ${varName}.range to be an Array of length 2`);

		node.range.forEach((value, index) => {
			if (!Number.isSafeInteger(value))
				throw new TypeError(`Expected ${varName}.range[${index}] to be an Integer`);

			if (value < 0)
				throw new RangeError(`Expected ${varName}.range[${index}] to be greater than or equal to 0`);
		});

		return node;
	}

	/**
	 * Create a new Node Instance from a NodeInterface
	 * @param {NodeInterface} node 
	 * @param {string} [varName = 'node'] 
	 * @returns {Node}
	 */
	static fromJSON(node, varName = 'node') {
		if (typeof varName !== 'string')
			throw new TypeError('Expected varName to be a String');

		Node.verifyInterface(node, varName);

		return new Node(
			node.type,
			node.raw,
			Object.entries(node.children).reduce((children, [name, child]) => {
				if (Array.isArray(child))
					children[name] = child.map(child => Node.fromJSON(child, `${varName}.children.${name}`));
				else
					children[name] = Node.fromJSON(child, `${varName}.children.${name}`);

				return children;
			}, {}),
			node.range
		);
	}

	/**
	 * Create a new Node Instance
	 * @param {'MATCH' | 'RECOVER'} type 
	 * @param {string} raw 
	 * @param {{ [key: string]: Node | Node[] }} children 
	 * @param {[number, number]} range 
	 */
	constructor(type, raw, children, range) {
		if (typeof type !== 'string')
			throw new TypeError('Expected type to be a String');

		if (!['MATCH', 'RECOVER'].includes(type.toUpperCase()))
			throw new RangeError('Expected type to be either "MATCH" or "RECOVER"');

		if (typeof raw !== 'string')
			throw new TypeError('Expected raw to be a String');

		if (Object.prototype.toString.call(children) !== '[object Object]')
			throw new TypeError('Expected children to be an Object');

		Object.entries(children).forEach(([key, value]) => {
			if (!((value instanceof Node) || (Array.isArray(value) && value.every(child => child instanceof Node))))
				throw new TypeError(`Expected children.${key} to be an instance of Node or an Array of Node Instances`);
		});

		if (!Array.isArray(range))
			throw new TypeError('Expected range to be an Array');

		if (range.length !== 2)
			throw new RangeError('Expected range to be an Array of length 2');

		range.forEach((value, index) => {
			if (!Number.isSafeInteger(value))
				throw new TypeError(`Expected range[${index}] to be an Integer`);

			if (value < 0)
				throw new RangeError(`Expected range[${index}] to be greater than or equal to 0`);
		});

		this.#type = type.toUpperCase();
		this.#raw = raw;
		this.#children = children;
		this.#range = range;
	}

	/**
	 * Get the type of the Node
	 * @returns {'MATCH' | 'RECOVER'}
	 */
	get type() {
		return this.#type;
	}

	/**
	 * Get the raw value of the Node
	 * @returns {string}
	 */
	get raw() {
		return this.#raw;
	}

	/**
	 * Get the children of the Node
	 * @returns {{ [key: string]: Node | Node[] }}
	 */
	get children() {
		return this.#children;
	}

	/**
	 * Get the range of the Node
	 * @returns {[number, number]}
	 */
	get range() {
		return this.#range;
	}

	/**
	 * Convert the Node to a NodeInterface
	 * @returns {NodeInterface}
	 */
	toJSON() {
		return {
			type: this.#type,
			value: this.#raw,
			children: Object.entries(this.#children).reduce((children, [name, child]) => {
				if (Array.isArray(child))
					children[name] = child.map(child => child.toJSON());
				else
					children[name] = child.toJSON();

				return children;
			}, {}),
			range: this.#range
		};
	}
}

class QuantitySelector {
	/**
	 * @type {Rule}
	 */
	#ruleInstance;

	/**
	 * Create a new Quantity Selector
	 * @param {Rule} ruleInstance 
	 */
	constructor(ruleInstance) {
		if (!(ruleInstance instanceof Rule))
			throw new TypeError('Expected ruleInstance to be a Rule');

		this.#ruleInstance = ruleInstance;
	}

	/**
	 * Set the Match Quantity to One
	 * @returns {ComponentSelector}
	 */
	one() {
		return new ComponentSelector(this.#ruleInstance, false, false);
	}

	/**
	 * Set the Match Quantity to Zero or One
	 * @returns {ComponentSelector}
	 */
	zeroOrOne() {
		return new ComponentSelector(this.#ruleInstance, false, true);
	}

	/**
	 * Set the Match Quantity to Zero or More
	 * @returns {ComponentSelector}
	 */
	zeroOrMore() {
		return new ComponentSelector(this.#ruleInstance, true, true);
	}

	/**
	 * Set the Match Quantity to One or More
	 * @returns {ComponentSelector}
	 */
	oneOrMore() {
		return new ComponentSelector(this.#ruleInstance, true, false);
	}
}

class ComponentSelector {
	/**
	 * @type {Rule}
	 */
	#ruleInstance;
	/**
	 * @type {boolean}
	 */
	#greedy;
	/**
	 * @type {boolean}
	 */
	#optional;

	/**
	 * Create a new Component Selector
	 * @param {Rule} ruleInstance 
	 * @param {boolean} [greedy=false] 
	 * @param {boolean} [optional=false] 
	 */
	constructor(ruleInstance, greedy = false, optional = false) {
		if (!(ruleInstance instanceof Rule))
			throw new TypeError('Expected ruleInstance to be a Rule');

		if (typeof greedy !== 'boolean')
			throw new TypeError('Expected greedy to be a Boolean');

		if (typeof optional !== 'boolean')
			throw new TypeError('Expected optional to be a Boolean');

		this.#ruleInstance = ruleInstance;
		this.#greedy = greedy;
		this.#optional = optional;
	}

	/**
	 * Select a String Component
	 * @param {string} string 
	 * @param {string | null} [name=null] 
	 * @returns {Rule}
	 */
	string(string, name = null) {
		if (typeof string !== 'string')
			throw new TypeError('Expected string to be a String');

		if (name !== null && typeof name !== 'string')
			throw new TypeError('Expected name to be a String or null');

		return this.#ruleInstance.addComponent(new Component('STRING', string, name, this.#greedy, this.#optional));
	}

	/**
	 * Select a RegExp Component
	 * @param {RegExp} regexp 
	 * @param {string | null} [name=null] 
	 * @returns {Rule}
	 */
	regexp(regexp, name = null) {
		if (!(regexp instanceof RegExp))
			throw new TypeError('Expected regexp to be a RegExp');

		if (name !== null && typeof name !== 'string')
			throw new TypeError('Expected name to be a String or null');

		return this.#ruleInstance.addComponent(new Component('REGEXP', regexp.source, name, this.#greedy, this.#optional));
	}

	/**
	 * Select a Variant Component
	 * @param {string} variant 
	 * @param {string | null} [name=null] 
	 * @returns {Rule}
	 */
	variant(variant, name = null) {
		if (name !== null && typeof name !== 'string')
			throw new TypeError('Expected name to be a String or null');

		if (typeof variant !== 'string')
			throw new TypeError('Expected variant to be a String');

		return this.#ruleInstance.addComponent(new Component('VARIANT', variant, name, this.#greedy, this.#optional));
	}
}

class Component {
	#type;
	#value;
	#name;
	#optional;
	#greedy;

	/**
	 * Verify that the given component is a valid ComponentInterface
	 * @param {unknown} component 
	 * @param {string} [varName = 'component'] 
	 * @returns {ComponentInterface}
	 */
	static verifyInterface(component, varName = 'component') {
		if (Object.prototype.toString.call(component) !== '[object Object]')
			throw new TypeError(`Expected ${varName} to be an Object`);

		if (typeof component.type !== 'string')
			throw new TypeError(`Expected ${varName}.type to be a String`);

		if (!['STRING', 'REGEXP', 'VARIANT'].includes(component.type.toUpperCase()))
			throw new RangeError(`Expected ${varName}.type to be "STRING", "REGEXP" or "VARIANT"`);

		if (typeof component.value !== 'string')
			throw new TypeError(`Expected ${varName}.value to be a String`);

		if (component.name !== null && typeof component.name !== 'string')
			throw new TypeError(`Expected ${varName}.name to be a String or null`);

		if (typeof component.optional !== 'boolean')
			throw new TypeError(`Expected ${varName}.optional to be a Boolean`);

		if (typeof component.greedy !== 'boolean')
			throw new TypeError(`Expected ${varName}.greedy to be a Boolean`);

		return component;
	}

	/**
	 * Create a new Component from a ComponentInterface
	 * @param {ComponentInterface} component 
	 * @param {string} [varName = 'component'] 
	 * @returns {Component}
	 */
	static fromJSON(component, varName = 'component') {
		if (typeof varName !== 'string')
			throw new TypeError('Expected path to be a String');

		Component.verifyInterface(component, varName);

		return new Component(component.type.toUpperCase(), component.value, component.name, component.optional, component.greedy);
	}

	/**
	 * Create a new Component Instance
	 * @param {'STRING' | 'REGEXP' | 'VARIANT'} type 
	 * @param {string} value 
	 * @param {string | null} [name = null] 
	 * @param {boolean} [optional = false] 
	 * @param {boolean} [greedy = false] 
	 */
	constructor(type, value, name = null, optional = false, greedy = false) {
		if (typeof type !== 'string')
			throw new TypeError('Expected type to be a String');

		if (!['STRING', 'REGEXP', 'VARIANT'].includes(type.toUpperCase()))
			throw new RangeError('Expected type to be "STRING", "REGEXP" or "VARIANT"');

		if (typeof value !== 'string')
			throw new TypeError('Expected value to be a String');

		if (name !== null && typeof name !== 'string')
			throw new Error('Expected name to be a String or null');

		if (typeof optional !== 'boolean')
			throw new TypeError('Expected optional to be a Boolean');

		if (typeof greedy !== 'boolean')
			throw new TypeError('Expected greedy to be a Boolean');

		this.#type = type.toUpperCase();
		this.#value = value;
		this.#name = name;
		this.#optional = optional;
		this.#greedy = greedy;
	}

	/**
	 * Get the type of the Component
	 * @returns {'STRING' | 'REGEXP' | 'VARIANT'}
	 */
	get type() {
		return this.#type;
	}

	/**
	 * Get the value of the Component
	 * @returns {string}
	 */
	get value() {
		return this.#value;
	}

	/**
	 * Get the name of the Component
	 * @returns {string | null}
	 */
	get name() {
		return this.#name;
	}

	/**
	 * Get whether the Component is optional
	 * @returns {boolean}
	 */
	get optional() {
		return this.#optional;
	}

	/**
	 * Get whether the Component is greedy
	 * @returns {boolean}
	 */
	get greedy() {
		return this.#greedy;
	}

	/**
	 * Get the match function of the Component
	 * @returns {(input: string, precedingNode: Node | null, grammarContext: Grammar) => Node}
	 */
	get matchFunction() {
		switch (this.#type) {
			case 'STRING':
				return (input, precedingNode, grammarContext) => {
					if (typeof input !== 'string')
						throw new TypeError('Expected input to be a String');

					if (precedingNode !== null && !(precedingNode instanceof Node))
						throw new TypeError('Expected precedingNode to be an instance of Node or null');

					if (!(grammarContext instanceof Grammar))
						throw new TypeError('Expected grammarContext to be an instance of Parser');

					if (!input.startsWith(this.#value))
						throw new MisMatchError(`Expected ${this.#value}`, precedingNode ? precedingNode.range[1] + 1 : 0);

					if (precedingNode)
						return new Node('MATCH', this.#value, {}, [
							precedingNode.range[1] + 1,
							precedingNode.range[1] + this.#value.length
						]);

					return new Node('MATCH', this.#value, {}, [0, this.#value.length]);
				};
			case 'REGEXP':
				return (input, precedingNode, grammarContext) => {
					if (typeof input !== 'string')
						throw new TypeError('Expected input to be a String');

					if (precedingNode !== null && !(precedingNode instanceof Node))
						throw new TypeError('Expected precedingNode to be an instance of Node or null');

					if (!(grammarContext instanceof Grammar))
						throw new TypeError('Expected grammarContext to be an instance of Parser');

					const match = input.match(new RegExp(this.#value));
					if (!match)
						throw new MisMatchError(`Expected /${this.#value}/`, precedingNode ? precedingNode.range[1] + 1 : 0);

					if (precedingNode)
						return new Node('MATCH', match[0], {}, [
							precedingNode.range[1] + 1,
							precedingNode.range[1] + this.#value.length
						]);

					return new Node('MATCH', this.#value, {}, [0, this.#value.length - 1]);
				};
			case 'VARIANT':
				return (input, precedingNode, grammarContext) => {
					if (typeof input !== 'string')
						throw new TypeError('Expected input to be a String');

					if (precedingNode !== null && !(precedingNode instanceof Node))
						throw new TypeError('Expected precedingNode to be an instance of Node or null');

					if (!(grammarContext instanceof Grammar))
						throw new TypeError('Expected grammarContext to be an instance of Grammar');

					const ruleVariant = grammarContext.variants.get(this.#value);

					return ruleVariant.parse(input, precedingNode, grammarContext);
				};
		}
	}

	/**
	 * Convert this Component to a ComponentInterface
	 * @returns {ComponentInterface}
	 */
	toJSON() {
		return {
			type: this.#type,
			value: this.#value,
			name: this.#name,
			optional: this.#optional,
			greedy: this.#greedy
		};
	}
}

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

class Variant {
	#rules;

	/**
	 * Verify that the given variant is a valid VariantInterface
	 * @param {unknown} variant 
	 * @param {string} [varName = 'variant'] 
	 * @returns {VariantInterface}
	 */
	static verifyInterface(variant, varName = 'variant') {
		if (!Array.isArray(variant))
			throw new TypeError(`Expected ${varName} to be an Array`);

		variant.forEach((rule, index) => {
			Rule.verifyInterface(rule, `${varName}[${index}]`);
		});

		return variant;
	}

	/**
	 * Create a new Variant Instance from a VariantInterface
	 * @param {VariantInterface} variant 
	 * @param {string} [varName = 'variant'] 
	 * @returns {Variant}
	 */
	static fromJSON(variant, varName = 'variant') {
		if (typeof varName !== 'string')
			throw new TypeError('Expected path to be a string');

		if (!Array.isArray(variant))
			throw new TypeError(`Expected ${varName} to be an Array`);

		return new Variant(variant.map((rule, index) => Rule.fromJSON(rule, `${varName}[${index}]`)));
	}

	/**
	 * Create a new Variant Instance
	 * @param {Rule[]} [rules = []] 
	 */
	constructor(rules = []) {
		if (!Array.isArray(rules))
			throw new TypeError('Expected rules to be an Array');

		rules.forEach((rule, index) => {
			if (!(rule instanceof Rule))
				throw new TypeError(`Expected rules[${index}] to be an instance of Rule`);
		});

		this.#rules = rules;
	}

	/**
	 * Add a Rule to this Variant
	 * @param {Rule} rule 
	 * @returns {Variant}
	 */
	addRule(rule) {
		if (!(rule instanceof Rule))
			throw new TypeError('Expected rule to be an instance of Rule');

		this.#rules.push(rule);

		return this;
	}

	/**
	 * Get the Rules of this Variant
	 * @returns {Rule[]}
	 */
	getRules() {
		return this.#rules;
	}

	/**
	 * Clear the Rules of this Variant
	 */
	clearRules() {
		this.#rules = [];
	}

	/**
	 * Parse the give source
	 * @param {string} source 
	 * @param {Node | null} precedingNode 
	 * @param {Grammar} grammarContext 
	 * @returns {Node}
	 */
	parse(source, precedingNode, grammarContext) {
		if (typeof source !== 'string')
			throw new TypeError('Expected source to be a string');

		if (!(precedingNode instanceof Node) && (precedingNode !== null))
			throw new TypeError('Expected precedingNode to be an instance of Node or null');

		if (!(grammarContext instanceof Grammar))
			throw new TypeError('Expected grammarContext to be an instance of Grammar');

		for (const rule of this.#rules) {
			try {
				return rule.parse(source, precedingNode, grammarContext);
			}
			catch (error) { }
		}

		throw new VariantError('No Rule matched', precedingNode ? precedingNode.range[1] + 1 : 0);
	}

	/**
	 * Convert this Variant to a VariantInterface
	 * @returns {VariantInterface}
	 */
	toJSON() {
		return this.#rules.map(rule => rule.toJSON());
	}
}

class Grammar {
	#variants;

	/**
	 * Verify that the given grammar is a valid GrammarInterface
	 * @param {unknown} grammar 
	 * @param {string} [varName = 'grammar'] 
	 * @returns {GrammarInterface}
	 */
	static verifyInterface(grammar, varName = 'grammar') {
		if (typeof varName !== 'string')
			throw new TypeError('Expected varName to be a String');

		if (Object.prototype.toString.call(grammar) !== '[object Object]')
			throw new TypeError(`Expected ${varName} to be an Object`);

		Object.entries(grammar).forEach(([key, value]) => {
			Variant.verifyInterface(value, `${varName}.${key}`);
		});

		return grammar;
	}

	/**
	 * Create a new Grammar Instance from a GrammarInterface
	 * @param {GrammarInterface} grammar 
	 * @param {string} [varName = 'grammar'] 
	 * @returns {Grammar}
	 */
	static fromJSON(grammar, varName = 'grammar') {
		if (typeof varName !== 'string')
			throw new TypeError('Expected varName to be a String');

		if (Object.prototype.toString.call(grammar) !== '[object Object]')
			throw new TypeError(`Expected ${varName} to be an Object`);

		return new Grammar(Object.entries(grammar).reduce((result, [key, value]) => {
			return {
				...result,
				[key]: Variant.fromJSON(value, `${varName}.${key}`)
			}
		}, {}));
	}

	/**
	 * Create a new Grammar Instance
	 * @param {{ [key: string]: Variant }} [variants = {}]
	 */
	constructor(variants = {}) {
		if (Object.prototype.toString.call(variants) !== '[object Object]')
			throw new TypeError('Expected variants to be a GrammarInterface');

		Object.entries(variants).forEach(([key, value]) => {
			if (!(value instanceof Variant))
				throw new TypeError(`Expected variants[${key}] to be an instance of Variant`);
		});

		this.#variants = variants;
	}

	/**
	 * Get a Variant
	 * @param {string} name
	 * @returns {Variant | undefined}
	 */
	getVariant(name) {
		if (typeof name !== 'string')
			throw new TypeError('Expected name to be a String');

		return this.#variants[name];
	}

	/**
	 * Set a Variant
	 * @param {string} name 
	 * @param {Variant} variant 
	 * @returns {Grammar}
	 */
	setVariant(name, variant) {
		if (typeof name !== 'string')
			throw new TypeError('Expected name to be a String');

		if (!(variant instanceof Variant))
			throw new TypeError('Expected variant to be an instance of Variant');

		if (this.hasVariant(name))
			throw new ReferenceError(`Variant ${name} already exists`);

		this.#variants[name] = variant;
		return this;
	}

	/**
	 * Check if a Variant exists
	 * @param {string} name 
	 * @returns {boolean}
	 */
	hasVariant(name) {
		if (typeof name !== 'string')
			throw new TypeError('Expected name to be a String');

		return this.#variants[name] instanceof Variant;
	}

	/**
	 * Delete a Variant
	 * @param {string} name 
	 * @returns {boolean}
	 */
	deleteVariant(name) {
		if (typeof name !== 'string')
			throw new TypeError('Expected name to be a String');

		if (!this.hasVariant(name))
			return false;

		return delete this.#variants[name];
	}

	/**
	 * Delete all Variants
	 * @returns {void}
	 */
	clearVariants() {
		this.#variants = {};
	}

	/**
	 * Parse the given source using the given rootVariant
	 * @param {string} source 
	 * @param {string} rootVariant 
	 * @returns {Node}
	 */
	parse(source, rootVariant) {
		if (typeof source !== 'string')
			throw new TypeError('Expected source to be a String');

		if (typeof rootVariant !== 'string')
			throw new TypeError('Expected rootVariant to be a String');

		if (!this.hasVariant(rootVariant))
			throw new ReferenceError('Expected rootVariant to be an existing Variant');

		return this.#variants[rootVariant].parse(source, null, this);
	}

	/**
	 * Convert this Grammar to a GrammarInterface
	 * @returns {GrammarInterface}
	 */
	toJSON() {
		return Object.entries(this.#variants).reduce((result, [key, value]) => {
			return { ...result, [key]: value.toJSON() };
		}, {});
	}
}

module.exports = {
	Grammar,
	Variant,
	Rule,
	Component,
	Node,
	error: {
		VariantError,
		MisMatchError,
		AutoThrowError,
	}
}