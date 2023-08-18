import { Node } from './lib/Node';
import { MisMatchError } from './lib/errors/MisMatchError';
import type { Grammar } from './Grammar';

export interface ComponentInterface {
	type: 'STRING' | 'REGEXP' | 'VARIANT';
	value: string;
	name: string | null;
	greedy: boolean;
	optional: boolean;
}

export class Component {
	private _type: 'STRING' | 'REGEXP' | 'VARIANT';
	private _value: string;
	private _name: string | null;
	private _greedy: boolean;
	private _optional: boolean;

	public static fromJSON(json: ComponentInterface): Component {
		return new Component(json.type, json.value, json.name, json.greedy, json.optional);
	}

	public constructor(type: 'STRING' | 'REGEXP' | 'VARIANT', value: string, name: string | null = null, greedy: boolean = false, optional: boolean = false) {
		this._type = type;
		this._value = value;
		this._name = name;
		this._greedy = greedy;
		this._optional = optional;
	}

	public get type(): 'STRING' | 'REGEXP' | 'VARIANT' {
		return this._type;
	}

	public get value(): string {
		return this._value;
	}

	public get name(): string | null {
		return this._name;
	}

	public get greedy(): boolean {
		return this._greedy;
	}

	public get optional(): boolean {
		return this._optional;
	}

	public get matchFunction(): (source: string, precedingNode: Node | null, grammarContext: Grammar) => Node {
		switch (this._type) {
			case 'STRING':
				return (source: string, precedingNode: Node | null) => {
					if (!source.startsWith(this._value))
						throw new MisMatchError(`Expected ${this._value}`, precedingNode ? precedingNode.range[1] + 1 : 0);

					if (precedingNode)
						return new Node('MATCH', this._value, {}, [
							precedingNode.range[1] + 1,
							precedingNode.range[1] + this._value.length
						]);

					return new Node('MATCH', this._value, {}, [0, this._value.length - 1]);
				};
			case 'REGEXP':
				return (source: string, precedingNode: Node | null) => {
					const match = source.match(new RegExp(this._value));
					if (!match)
						throw new MisMatchError(`Expected /${this._value}/`, precedingNode ? precedingNode.range[1] + 1 : 0);

					if (precedingNode)
						return new Node('MATCH', match[0], {}, [
							precedingNode.range[1] + 1,
							precedingNode.range[1] + match[0].length
						]);

					return new Node('MATCH', match[0], {}, [0, match[0].length - 1]);
				};
			case 'VARIANT':
				return (source: string, precedingNode: Node | null, grammarContext: Grammar) => {
					if (!grammarContext.hasVariant(this._value))
						throw new ReferenceError(`Expected ${this._value} to be an existing Variant`);

					const variant = grammarContext.getVariant(this._value)!;

					return variant.parse(source, precedingNode, grammarContext);
				};
		}

	}

	public toJSON(): ComponentInterface {
		return {
			type: this._type,
			value: this._value,
			name: this._name,
			greedy: this._greedy,
			optional: this._optional
		};
	}
}