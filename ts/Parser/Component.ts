import * as Node from '../lib/Node';
import * as Variant from './Variant';
import * as Parser from './Parser';
import { MisMatchError } from '../lib/errors/MisMatchError';

export interface ComponentInterface {
	type: 'STRING' | 'REGEXP' | 'VARIANT';
	value: string;
	name: string | null;
	optional: boolean;
	greedy: boolean;
}

export enum TYPE {
	STRING = 'STRING',
	REGEXP = 'REGEXP',
	VARIANT = 'VARIANT',
}

export class Component {
	private _type: TYPE;
	private _value: string;
	private _name: string | null;
	private _optional: boolean;
	private _greedy: boolean;

	public constructor(type: TYPE, value: string, name: string | null, optional: boolean = false, greedy: boolean = false) {
		this._type = type;
		this._value = value;
		this._name = name;
		this._optional = optional;
		this._greedy = greedy;
	}

	public get type() {
		return this._type;
	}

	public get value() {
		return this._value;
	}

	public get name() {
		return this._name;
	}

	public get optional() {
		return this._optional;
	}

	public get greedy() {
		return this._greedy;
	}

	public get matchFunction(): (input: string, precedingNode: Node.Node | null, parserContext: Parser.Parser) => Node.Node {
		switch (this._type) {
			case TYPE.STRING:
				return (input: string, precedingNode: Node.Node | null, parserContext: Parser.Parser): Node.Node => {
					if (!input.startsWith(this._value))
						throw new MisMatchError(`Expected ${this._value}`, precedingNode ? precedingNode.range[1] + 1 : 0);

					if (precedingNode)
						return new Node.Node(Node.TYPE.MATCH, this._value, {}, [
							precedingNode.range[1] + 1,
							precedingNode.range[1] + this._value.length
						]);

					return new Node.Node(Node.TYPE.MATCH, this._value, {}, [0, this._value.length]);
				};
			case TYPE.REGEXP:
				return (input: string, precedingNode: Node.Node | null, parserContext: Parser.Parser): Node.Node => {
					const match = input.match(new RegExp(this._value));

					if (!match)
						throw new MisMatchError(`Expected /${this._value}/`, precedingNode ? precedingNode.range[1] + 1 : 0);

					if (precedingNode)
						return new Node.Node(Node.TYPE.MATCH, match[0], {}, [
							precedingNode.range[1] + 1,
							precedingNode.range[1] + this._value.length
						]);

					return new Node.Node(Node.TYPE.MATCH, this._value, {}, [0, this._value.length]);
				};
			case TYPE.VARIANT:
				return (input: string, precedingNode: null | Node.Node, parserContext: Parser.Parser): Node.Node => {
					const ruleVariant = parserContext.variants.get(this._value) as Variant.Variant;

					return ruleVariant.execute(input, precedingNode, parserContext);
				}
		}
	}

	public toJSON(): ComponentInterface {
		return {
			type: this._type,
			value: this._value,
			name: this._name,
			optional: this._optional,
			greedy: this._greedy
		};
	}

	public static verifyInterface(data: any, varName: string = 'data'): ComponentInterface {
		if (Object.prototype.toString.call(data) !== '[object Object]')
			throw new TypeError(`Expected ${varName} to be an Object`);

		if (typeof data.type !== 'string')
			throw new TypeError(`Expected ${varName}.type to be a String`);

		if(!['STRING', 'REGEXP', 'VARIANT'].includes(data.type.toUpperCase()))
			throw new RangeError(`Expected ${varName}.type to be "STRING", "REGEXP" or "VARIANT"`)

		if (typeof data.value !== 'string')
			throw new TypeError(`Expected ${varName}.value to be a String`);

		if (data.name !== null && typeof data.name !== 'string')
			throw new Error(`Expected ${varName}.name to be a String or null`);

		if (typeof data.optional !== 'boolean')
			throw new TypeError(`Expected ${varName}.optional to be a Boolean`);

		if (typeof data.greedy !== 'boolean')
			throw new TypeError(`Expected ${varName}.greedy to be a Boolean`);

		return data as ComponentInterface;
	}

	public static fromJSON(json: ComponentInterface): Component {
		return new Component(json.type.toUpperCase() as TYPE, json.value, json.name, json.optional, json.greedy);
	}
}