import { BaseComponentInterface, ComponentSetInterface, RuleInterface } from '../../Interfaces';
import { Grammar } from './Grammar';

import { Node } from '../lib/Node';

import { CustomError } from '../lib/errors/CustomError';
import { MisMatchError } from '../lib/errors/MisMatchError';

type recoverMatchFunction = (source: string, precedingNode: Node | null) => Node | null;
type matchFunction = (source: string, precedingNode: Node | null, grammarContext: Grammar) => Node;

export class Rule {
	private _components: ComponentSetInterface[];
	private _throwMessage: string | null;
	private _recoverComponent: BaseComponentInterface | null;

	public static fromJSON(json: RuleInterface): Rule {
		return new Rule(
			json.components,
			json.throwMessage,
			json.recoverComponent
		);
	}

	private constructor(components: ComponentSetInterface[], throwMessage: string | null, recoverComponent: BaseComponentInterface | null) {
		this._components = components;
		this._throwMessage = throwMessage;
		this._recoverComponent = recoverComponent;
	}

	private _getRecoverMatchFunction(component: BaseComponentInterface): recoverMatchFunction {
		switch (component.type) {
			case 'STRING':
				return (source: string, precedingNode: Node | null): Node | null => {
					let slicedSource = source;

					for (let i = 0; slicedSource.length > 0; i++) {
						if (!slicedSource.startsWith(component.value))
							continue;

						if (precedingNode)
							return new Node('RECOVER', component.value, {}, [
								precedingNode.range[1] + 1 + i,
								precedingNode.range[1] + component.value.length + i
							]);

						return new Node('RECOVER', component.value, {}, [0 + i, component.value.length - 1 + i]);
					}

					return null;
				}
			case 'REGEXP':
				return (source: string, precedingNode: Node | null) => {
					let slicedSource = source;

					for (let i = 0; slicedSource.length > 0; i++) {
						const match = slicedSource.match(new RegExp(component.value.startsWith('^') ? component.value : `^${component.value}`));

						if (!match)
							continue;

						if (precedingNode)
							return new Node('RECOVER', match[0], {}, [
								precedingNode.range[1] + 1 + i,
								precedingNode.range[1] + match[0].length + i
							]);

						return new Node('RECOVER', match[0], {}, [i, (match[0].length - 1) + i]);
					}

					return null;
				}
			default:
				throw new RangeError(`Expected component.type to be either "STRING" or "REGEXP"`);
		}
	}

	private _getMatchFunction(component: BaseComponentInterface): matchFunction {
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
					const match = source.match(new RegExp(component.value.startsWith('^') ? component.value : `^${component.value}`));

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
					return grammarContext.parse(source, component.value, false, precedingNode);
				};
		}
	}

	private _parseComponentSet(componentSet: ComponentSetInterface, source: string, precedingNode: Node | null, grammarContext: Grammar): [string, { [key: string]: Node[] }, Node | null] {
		let rest: string = source;
		const namedNodes: { [key: string]: Node[] } = {};
		let currentPrecedingNode: Node | null = precedingNode;

		// Match every Component in the ComponentSet
		for (let component of componentSet.components) {
			const result = this._getMatchFunction(component)(rest, currentPrecedingNode, grammarContext);

			// If the Component is named, add it to the namedNodes Object
			if (component.name) {
				if (!Array.isArray(namedNodes[component.name]))
					namedNodes[component.name] = [];

				namedNodes[component.name].push(result);
			}

			rest = rest.slice(result.raw.length);
			currentPrecedingNode = result;
		}

		return [rest, namedNodes, currentPrecedingNode];
	}

	public parse(source: string, precedingNode: Node | null, grammarContext: Grammar): Node {
		let rest: string = source;
		const namedNodes: { [key: string]: Node[] } = {};
		let currentPrecedingNode: Node | null = precedingNode;

		// If a Custom Throw Message was set, throw an Error
		if (this._throwMessage)
			throw new CustomError(this._throwMessage, precedingNode ? precedingNode.range[1] + 1 : 0);

		// Attempt to parse all ComponentSets
		try {
			for (let componentSet of this._components) {
				try {
					const result = this._parseComponentSet(componentSet, rest, currentPrecedingNode, grammarContext);

					// Update the global rest, namedNodes and currentPrecedingNode
					rest = result[0];
					new Set([...Object.keys(namedNodes), ...Object.keys(result[1])]).forEach(key => {
						if (Array.isArray(result[1][key])) {
							if (!Array.isArray(namedNodes[key]))
								namedNodes[key] = [];

							namedNodes[key].push(...result[1][key]);
						}
					});
					currentPrecedingNode = result[2];

					// If the ComponentSet is greedy, try to match until it throws an Error
					if (componentSet.greedy) {
						while (true) {
							try {
								const result = this._parseComponentSet(componentSet, rest, currentPrecedingNode, grammarContext);

								// Update the global rest, namedNodes and currentPrecedingNode
								rest = result[0];
								new Set([...Object.keys(namedNodes), ...Object.keys(result[1])]).forEach(key => {
									if (Array.isArray(result[1][key])) {
										if (!Array.isArray(namedNodes[key]))
											namedNodes[key] = [];

										namedNodes[key].push(...result[1][key]);
									}
								});
								currentPrecedingNode = result[2];
							}
							catch (error) {
								break;
							}
						}
					}
				}
				catch (error) {
					// If the optional Flag is set, continue to the next ComponentSet
					if (componentSet.optional)
						continue;

					// If the optional Flag is not set, propagate the Error to the caller.
					throw error;
				}
			}
		}
		catch (error) {
			// If there was an Error and a Recover Component was set, attempt to recover
			if (this._recoverComponent) {
				try {
					const result = this._getRecoverMatchFunction(this._recoverComponent)(source, precedingNode);

					// If the Recover Component was found, return the Node
					if (result) {
						return result;
					}
				}
				catch (error) { }
			}
		}

		const raw: string = source.slice(0, source.length - rest.length);

		return new Node('MATCH', raw, namedNodes, [
			precedingNode ? precedingNode.range[1] + 1 : 0,
			precedingNode ? precedingNode.range[1] + raw.length : (raw.length - 1)
		]);
	}
}