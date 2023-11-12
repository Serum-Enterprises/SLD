import { ComponentInterface, PrefixComponentInterface, RecoverComponentInterface, RuleInterface } from '../../Builder';
import { Grammar } from './Grammar';

import { Node } from '../lib/Node';

import { CustomError } from '../lib/errors/CustomError';
import { MisMatchError } from '../lib/errors/MisMatchError';

type recoverMatchFunction = (source: string, precedingNode: Node | null) => Node | null;
type prefixMatchFunction = (source: string, precedingNode: Node | null) => Node | null;
type matchFunction = (source: string, precedingNode: Node | null, grammarContext: Grammar) => Node;

export class Rule {
	private _components: ComponentInterface[];
	private _throwMessage: string | null;
	private _recoverComponent: RecoverComponentInterface | null;

	public static fromJSON(json: RuleInterface): Rule {
		return new Rule(
			json.components,
			json.throwMessage,
			json.recoverComponent
		);
	}

	private constructor(components: ComponentInterface[], throwMessage: string | null, recoverComponent: RecoverComponentInterface | null) {
		this._components = components;
		this._throwMessage = throwMessage;
		this._recoverComponent = recoverComponent;
	}

	private getRecoverMatchFunction(component: RecoverComponentInterface): recoverMatchFunction {
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
		}
	}

	private getPrefixMatchFunction(component: PrefixComponentInterface): prefixMatchFunction {
		switch (component.type) {
			case 'STRING':
				return (source: string, precedingNode: Node | null) => {
					if (!source.startsWith(component.value))
						return null;

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
						return null;

					if (precedingNode)
						return new Node('MATCH', match[0], {}, [
							precedingNode.range[1] + 1,
							precedingNode.range[1] + match[0].length
						]);

					return new Node('MATCH', match[0], {}, [0, match[0].length - 1]);
				};
		}
	}

	private getMatchFunction(component: ComponentInterface): matchFunction {
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

	public parseComponent(component: ComponentInterface, source: string, precedingNode: Node | null, grammarContext: Grammar): [Node | null, Node] {
		let result: Node;
		let prefixResult: Node | null = null;

		if (component.prefix)
			prefixResult = this.getPrefixMatchFunction(component.prefix)(source, precedingNode);

		if (prefixResult) {
			result = this.getMatchFunction(component)(source.slice(prefixResult.raw.length), prefixResult, grammarContext);
		}
		else
			result = this.getMatchFunction(component)(source, precedingNode, grammarContext);

		return [prefixResult, result];
	}

	public parse(source: string, precedingNode: Node | null, grammarContext: Grammar) {
		let rest: string = source;
		const namedNodes: { [key: string]: Node[] } = {};
		let currentPrecedingNode: Node | null = precedingNode;

		// If a Custom Throw Message was set, throw an Error
		if (this._throwMessage)
			throw new CustomError(this._throwMessage, precedingNode ? precedingNode.range[1] + 1 : 0);

		try {
			// Try to match all Components
			for (let component of this._components) {
				try {
					const [prefixResult, result] = this.parseComponent(component, rest, currentPrecedingNode, grammarContext);

					if (prefixResult && component.prefix?.include && component.name !== null)
						namedNodes[component.name] = [prefixResult, result];
					else if (component.name !== null)
						namedNodes[component.name] = [result];

					rest = rest.slice(prefixResult ? prefixResult.raw.length + result.raw.length : result.raw.length);
					currentPrecedingNode = result;

					if (component.greedy) {
						for (let i = 0; true; i++) {
							try {
								const [prefixResult, result] = this.parseComponent(component, rest, currentPrecedingNode, grammarContext);

								if (prefixResult && component.prefix?.include && component.name !== null)
									namedNodes[component.name].push(prefixResult, result);

								rest = rest.slice(prefixResult ? prefixResult.raw.length + result.raw.length : result.raw.length);
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
				const recoverNode = this.getRecoverMatchFunction(this._recoverComponent)(source, precedingNode);

				if (recoverNode)
					return recoverNode;
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