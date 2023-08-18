import { Component, ComponentInterface } from "./Component";
import { Node } from './lib/Node';
import { Grammar } from './Grammar';
import { CustomThrowError } from './lib/errors/CustomThrowError';

export interface RuleInterface {
	components: ComponentInterface[];
	throwMessage: string | null;
	recoverComponent: ComponentInterface | null;
}

export class Rule {
	protected _components: Component[];
	protected _throwMessage: string | null;
	protected _recoverComponent: Component | null;

	public static fromJSON(json: RuleInterface): Rule {
		return new Rule(
			json.components.map(component => Component.fromJSON(component)),
			json.throwMessage,
			json.recoverComponent ? Component.fromJSON(json.recoverComponent) : null
		);
	}

	public constructor(components: Component[] = [], throwMessage: string | null = null, recoverComponent: Component | null = null) {
		this._components = components;
		this._throwMessage = throwMessage;
		this._recoverComponent = recoverComponent;
	}

	public addComponent(component: Component): Rule {
		this._components.push(component);

		return this;
	}

	public setThrowMessage(message: string): Rule {
		this._throwMessage = message;

		return this;
	}

	public setRecoverComponent(component: Component): Rule {
		this._recoverComponent = component;

		return this;
	}

	public parse(source: string, precedingNode: Node | null, grammarContext: Grammar) {
		let rest: string = source;
		let nodes: Node[] = [];
		let namedNodes: { [key: string]: Node | Node[] } = {};
		let currentPrecedingNode: Node | null = precedingNode;

		if (this._throwMessage)
			throw new CustomThrowError(this._throwMessage, precedingNode ? precedingNode.range[1] + 1 : 0);

		try {
			for (let component of this._components) {
				const matchFunction = component.matchFunction;

				try {
					let result: Node = matchFunction(rest, currentPrecedingNode, grammarContext);

					if (component.name !== null)
						namedNodes[component.name] = result;

					nodes.push(result);
					rest = rest.slice(result.raw.length);
					currentPrecedingNode = result;

					if (component.greedy) {
						let didThrow: boolean = false;

						while (!didThrow) {
							try {
								result = matchFunction(rest, currentPrecedingNode, grammarContext);

								if (component.name) {
									if (!Array.isArray(namedNodes[component.name]))
										namedNodes[component.name] = [(namedNodes[component.name] as Node), result];
									else
										(namedNodes[component.name] as Node[]).push(result);
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
					if (component.optional) {
						continue;
					}

					throw error;
				}
			}
		}
		catch (error) {
			if (this._recoverComponent) {
				const recoverNode = this._recoverComponent.matchFunction(source, precedingNode, grammarContext);

				return new Node('RECOVER', recoverNode.raw, recoverNode.children, recoverNode.range);
			}

			throw error;
		}

		const raw: string = source.slice(0, source.length - rest.length);

		return new Node('MATCH', raw, namedNodes, [
			precedingNode ? precedingNode.range[1] + 1 : 0,
			precedingNode ? precedingNode.range[1] + raw.length : (raw.length - 1)
		]);
	}

	public toJSON(): RuleInterface {
		return {
			components: this._components.map(component => component.toJSON()),
			throwMessage: this._throwMessage,
			recoverComponent: this._recoverComponent ? this._recoverComponent.toJSON() : null
		};
	}
}

export class RuleBuilder extends Rule {
	public static get match(): QuantitySelector {
		return new RuleBuilder().directlyFollowedBy;
	}

	public static throw(message: string): RuleBuilder {
		if (typeof message !== 'string')
			throw new TypeError('Expected message to be a String');

		return new RuleBuilder().throw(message);
	}

	public begin() {
		return new QuantitySelector(this);
	}

	public recover(type: 'STRING' | 'REGEXP' | 'VARIANT', value: string): RuleBuilder {
		this._components.push(new Component(type, value, null, false, false));

		return this;
	}

	public throw(message: string): RuleBuilder {
		this._throwMessage = message;

		return this;
	}

	public capture(name: string): RuleBuilder {
		if (this._components.length === 0)
			return this;

		const lastComponent = this._components.pop()!;

		this._components.push(new Component(lastComponent.type, lastComponent.value, name, lastComponent.greedy, lastComponent.optional));

		return this;
	}

	public get followedBy(): QuantitySelector {
		this._components.push(new Component('REGEXP', /\s+/.source, null, false, false));

		return new QuantitySelector(this);
	}

	public get directlyFollowedBy(): QuantitySelector {
		return new QuantitySelector(this);
	}
}

class ComponentSelector {
	private _ruleInstance: RuleBuilder;
	private _greedy: boolean;
	private _optional: boolean;

	public constructor(ruleInstance: RuleBuilder, greedy: boolean = false, optional: boolean = false) {
		this._ruleInstance = ruleInstance;
		this._greedy = greedy;
		this._optional = optional;
	}

	public string(string: string, name: string | null = null): RuleBuilder {
		this._ruleInstance.addComponent(new Component('STRING', string, name, this._greedy, this._optional));

		return this._ruleInstance;
	}

	public regexp(regexp: RegExp, name: string | null = null): RuleBuilder {
		this._ruleInstance.addComponent(new Component('REGEXP', regexp.source, name, this._greedy, this._optional));

		return this._ruleInstance;
	}

	public variant(variant: string, name: string | null = null): RuleBuilder {
		this._ruleInstance.addComponent(new Component('VARIANT', variant, name, this._greedy, this._optional));

		return this._ruleInstance;
	}
}

class QuantitySelector {
	private _ruleInstance: RuleBuilder;

	public constructor(ruleInstance: RuleBuilder) {
		this._ruleInstance = ruleInstance;
	}

	public get one(): ComponentSelector {
		return new ComponentSelector(this._ruleInstance, false, false);
	}

	public get zeroOrOne(): ComponentSelector {
		return new ComponentSelector(this._ruleInstance, false, true);
	}

	public get zeroOrMore(): ComponentSelector {
		return new ComponentSelector(this._ruleInstance, true, true);
	}

	public get oneOrMore(): ComponentSelector {
		return new ComponentSelector(this._ruleInstance, true, false);
	}
}