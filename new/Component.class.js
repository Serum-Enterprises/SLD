/*
declare enum ComponentType {
	STRING = 'STRING',
	REGEXP = 'REGEXP',
	VARIANT = 'VARIANT',
}

declare interface Component {
	type: ComponentType,
	name: string,
	value: string,
	optional: boolean,
	greedy: boolean
}
*/

class Component {
	#type;
	#name;
	#value;
	#optional;
	#greedy;
	
	constructor(type, name, value, optional = false, greedy = false) {
		if(typeof type !== 'string')
			throw new TypeError(`Expected type to be a String`);

		if(!['STRING', 'REGEXP', 'VARIANT'].includes(type))
			throw new RangeError(`Expected type to be one of 'STRING', 'REGEXP' or 'VARIANT'`);

		if(typeof name !== 'string')
			throw new TypeError(`Expected name to be a String`);

		if(typeof value !== 'string')
			throw new TypeError(`Expected value to be a String`);

		if(typeof optional !== 'boolean')
			throw new TypeError(`Expected optional to be a Boolean`);

		if(typeof greedy !== 'boolean')
			throw new TypeError(`Expected greedy to be a Boolean`);

		this.#type = type;
		this.#name = name;
		this.#value = value;
		this.#optional = optional;
		this.#greedy = greedy;
	}

	get type() {
		return this.#type;
	}

	get name() {
		return this.#name;
	}

	get value() {
		return this.#value;
	}

	get optional() {
		return this.#optional;
	}

	get greedy() {
		return this.#greedy;
	}

	toJSON() {
		return {
			type: this.#type,
			name: this.#name,
			value: this.#value,
			optional: this.#optional,
			greedy: this.#greedy
		};
	}
}

module.exports = Component;