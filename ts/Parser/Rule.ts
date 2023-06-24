import * as Component from './Component';
import * as Parser from './Parser';

import * as Node from '../lib/Node';
import { AutoThrowError } from '../lib/errors/AutoThrowError';

export interface RuleInterface {
	components: Component.ComponentInterface[];
	autoThrow: string | null;
	autoRecover: Component.ComponentInterface | null;
}

export class Rule {
	private _components: Component.Component[];
	private _autoThrow: string | null;
	private _autoRecover: Component.Component | null;

	public constructor(components: Component.Component[], autoThrow: string | null = null, autoRecover: Component.Component | null = null) {
		this._components = components;
		this._autoThrow = autoThrow;
		this._autoRecover = autoRecover;
	}
	public get components(): Component.Component[] {
		return this._components;
	}

	public get autoThrow(): string | null {
		return this._autoThrow;
	}

	public get autoRecover(): Component.Component | null {
		return this._autoRecover;
	}

	public execute(input: string, precedingNode: Node.Node | null, parentParser: Parser.Parser) {
		let rest: string = input;
		let nodes: Node.Node[] = [];
		let namedNodes: { [key: string]: Node.Node | Node.Node[] } = {};
		let currentPrecedingNode: Node.Node | null = precedingNode;

		if (this._autoThrow)
			throw new AutoThrowError(this._autoThrow, precedingNode ? precedingNode.range[1] + 1 : 0);

		try {
			for (let component of this._components) {
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
										namedNodes[component.name] = [namedNodes[component.name] as Node.Node, result];
									else
										(namedNodes[component.name] as Node.Node[]).push(result);
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
			if (this._autoRecover)
				return this._autoRecover.matchFunction(input, precedingNode, parentParser);

			throw error;
		}

		const raw = input.slice(0, input.length - rest.length);

		return new Node.Node(Node.TYPE.MATCH,
			raw,
			namedNodes,
			[
				precedingNode ? precedingNode.range[1] + 1 : 0,
				precedingNode ? precedingNode.range[1] + raw.length : raw.length
			]);
	}

	public toJSON(): RuleInterface {
		return {
			components: this._components.map(component => component.toJSON()),
			autoThrow: this._autoThrow,
			autoRecover: this._autoRecover ? this._autoRecover.toJSON() : null
		};
	}

	public static verifyInterface(data: any, varName: string = 'data'): RuleInterface {
		if (Object.prototype.toString.call(data) !== '[object Object]')
			throw new TypeError(`Expected ${varName} to be an Object`);

		if (!Array.isArray(data.components))
			throw new TypeError(`Expected ${varName}.components to be an Array`);

		data.components.forEach((component: any, index: number) => Component.Component.verifyInterface(component, `${varName}.components[${index}]`));

		if (data.autoThrow !== null && typeof data.autoThrow !== 'string')
			throw new TypeError(`Expected ${varName}.autoThrow to be a String or null`);

		if (data.autoRecover !== null)
			Component.Component.verifyInterface(data.autoRecover, `${varName}.autoRecover`);

		return data as RuleInterface;
	}

	public static fromJSON(data: RuleInterface): Rule {
		return new Rule(
			data.components.map((component: Component.ComponentInterface) => Component.Component.fromJSON(component)),
			data.autoThrow,
			data.autoRecover ? Component.Component.fromJSON(data.autoRecover) : null
		);
	}
}