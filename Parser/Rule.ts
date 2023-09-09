import { ComponentInterface, RuleInterface } from '../Builder';
import type { Grammar } from './Grammar';

import { Node } from './lib/Node';

import { CustomError } from './lib/errors/CustomError';
import { MisMatchError } from './lib/errors/MisMatchError';

export class Rule {
	private _components: ComponentInterface[];
	private _throwMessage: string | null;
	private _recoverComponent: ComponentInterface | null;

	public static fromJSON(json: RuleInterface): Rule {
		return new Rule(
			json.components,
			json.throwMessage,
			json.recoverComponent
		);
	}

	private constructor(components: ComponentInterface[], throwMessage: string | null, recoverComponent: ComponentInterface | null) {
		this._components = components;
		this._throwMessage = throwMessage;
		this._recoverComponent = recoverComponent;
	}

	private matchFunction(component: ComponentInterface) {
		switch (component.type) {
			case 'STRING':
				return (source: string, precedingNode: Node | null) => {
					if (!source.startsWith(component.value))
						throw new MisMatchError(`Expected ${component.value}`, precedingNode ? precedingNode.range[1] + 1 : 0);

					if (precedingNode)
						return new Node('MATCH', component.value, {}, [
							precedingNode.range[1] + 1,
							precedingNode.range[1] + component.value.length
						]);

					return new Node('MATCH', component.value, {}, [0, component.value.length - 1]);
				};
			case 'REGEXP':
				return (source: string, precedingNode: Node | null) => {
					const match = source.match(new RegExp(component.value));
					if (!match)
						throw new MisMatchError(`Expected /${component.value}/`, precedingNode ? precedingNode.range[1] + 1 : 0);

					if (precedingNode)
						return new Node('MATCH', match[0], {}, [
							precedingNode.range[1] + 1,
							precedingNode.range[1] + match[0].length
						]);

					return new Node('MATCH', match[0], {}, [0, match[0].length - 1]);
				};
			case 'VARIANT':
				return (source: string, precedingNode: Node | null, grammarContext: Grammar) => {
					return grammarContext.parse(source, component.value, precedingNode);
				};
		}
	}

	public parse(source: string, precedingNode: Node | null, grammarContext: Grammar) {
		let rest: string = source;
		const namedNodes: { [key: string]: Node | Node[] } = {};
		let currentPrecedingNode: Node | null = precedingNode;

		if (this._throwMessage)
			throw new CustomError(this._throwMessage, precedingNode ? precedingNode.range[1] + 1 : 0);

		try {
			for (let component of this._components) {
				const matchFunction = this.matchFunction(component);

				try {
					let result: Node = matchFunction(rest, currentPrecedingNode, grammarContext);

					if (component.name !== null)
						namedNodes[component.name] = result;

					rest = rest.slice(result.raw.length);
					currentPrecedingNode = result;

					if (component.greedy) {
						while (true) {
							try {
								result = matchFunction(rest, currentPrecedingNode, grammarContext);

								// TODO: Optimize
								if (component.name) {
									if (!Array.isArray(namedNodes[component.name]))
										namedNodes[component.name] = [(namedNodes[component.name] as Node), result];
									else
										(namedNodes[component.name] as Node[]).push(result);
								}

								rest = rest.slice(result.raw.length);
								currentPrecedingNode = result;
							}
							catch (error) {
								break;
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
			if (this._recoverComponent) {
				let slicedSource = source;

				for(let i = 0; slicedSource.length > 0; i++) {
					console.log(`Trying to recover ${source} with ${this._recoverComponent.value}`);
					try {
						const recoverNode = this.matchFunction(this._recoverComponent)(slicedSource, precedingNode, grammarContext);

						return new Node('RECOVER', recoverNode.raw, recoverNode.children, [recoverNode.range[0] + i, recoverNode.range[1] + i]);
					}
					catch(error) {
						slicedSource = slicedSource.slice(1);
					}
				}
			}

			throw error;
		}

		const raw: string = source.slice(0, source.length - rest.length);

		return new Node('MATCH', raw, namedNodes, [
			precedingNode ? precedingNode.range[1] + 1 : 0,
			precedingNode ? precedingNode.range[1] + raw.length : (raw.length - 1)
		]);
	}
}