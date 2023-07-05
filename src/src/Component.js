const { Grammar } = require('./Grammar');

const { Node } = require('../lib/Node');
const { MisMatchError } = require('../lib/errors/MisMatchError');

class Component {
	#type;
	#value;
	#name;
	#optional;
	#greedy;

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

	get type() {
		return this.#type;
	}

	get value() {
		return this.#value;
	}

	get name() {
		return this.#name;
	}

	get optional() {
		return this.#optional;
	}

	get greedy() {
		return this.#greedy;
	}

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

					return ruleVariant.execute(input, precedingNode, grammarContext);
				};
		}
	}

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

	toJSON() {
		return {
			type: this.#type,
			value: this.#value,
			name: this.#name,
			optional: this.#optional,
			greedy: this.#greedy
		};
	}

	static fromJSON(json, path = 'json', safe = true) {
		if (typeof path !== 'string')
			throw new TypeError('Expected path to be a String');

		if (typeof safe !== 'boolean')
			throw new TypeError('Expected safe to be a Boolean');

		if (safe)
			Component.verifyInterface(json, path);

		return new Component(json.type, json.value, json.name, json.optional, json.greedy);
	}
}

module.exports = { Component };