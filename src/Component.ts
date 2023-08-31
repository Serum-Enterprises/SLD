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
	public type: 'STRING' | 'REGEXP' | 'VARIANT';
	public value: string;
	public name: string | null;
	public greedy: boolean;
	public optional: boolean;

	public static fromJSON(json: ComponentInterface): Component {
		return new Component(json.type, json.value, json.name, json.greedy, json.optional);
	}

	public constructor(type: 'STRING' | 'REGEXP' | 'VARIANT', value: string, name: string | null = null, greedy: boolean = false, optional: boolean = false) {
		this.type = type;
		this.value = value;
		this.name = name;
		this.greedy = greedy;
		this.optional = optional;
	}

	public get matchFunction(): (source: string, precedingNode: Node | null, grammarContext: Grammar) => Node {
		switch (this.type) {
			case 'STRING':
				return (source: string, precedingNode: Node | null) => {
					if (!source.startsWith(this.value))
						throw new MisMatchError(`Expected ${this.value}`, precedingNode ? precedingNode.range[1] + 1 : 0);

					if (precedingNode)
						return new Node('MATCH', this.value, {}, [
							precedingNode.range[1] + 1,
							precedingNode.range[1] + this.value.length
						]);

					return new Node('MATCH', this.value, {}, [0, this.value.length - 1]);
				};
			case 'REGEXP':
				return (source: string, precedingNode: Node | null) => {
					const match = source.match(new RegExp(this.value));
					if (!match)
						throw new MisMatchError(`Expected /${this.value}/`, precedingNode ? precedingNode.range[1] + 1 : 0);

					if (precedingNode)
						return new Node('MATCH', match[0], {}, [
							precedingNode.range[1] + 1,
							precedingNode.range[1] + match[0].length
						]);

					return new Node('MATCH', match[0], {}, [0, match[0].length - 1]);
				};
			case 'VARIANT':
				return (source: string, precedingNode: Node | null, grammarContext: Grammar) => {
					const variant = grammarContext.variants.get(this.value)!;

					return variant.parse(source, precedingNode, grammarContext);
				};
		}

	}

	public toJSON(): ComponentInterface {
		return {
			type: this.type,
			value: this.value,
			name: this.name,
			greedy: this.greedy,
			optional: this.optional
		};
	}
}