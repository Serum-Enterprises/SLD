const Grammar = require('./Grammar');

const Node = require('../lib/Node');
const MisMatchError = require('../lib/errors/MisMatchError');

/**
 * @typedef {{ type: 'STRING' | 'REGEXP' | 'VARIANT', value: string, name: string | null, optional: boolean, greedy: boolean }} ComponentInterface
 */

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
			case TYPE.STRING:
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
			case TYPE.REGEXP:
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
			case TYPE.VARIANT:
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

module.exports = Component;