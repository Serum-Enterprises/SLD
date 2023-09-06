import { Component, ComponentInterface } from "./Component";

export interface RuleInterface {
	components: ComponentInterface[];
	throwMessage: string | null;
	recoverComponent: ComponentInterface | null;
}

export class Rule {
	private _components: Component[];
	private _throwMessage: string | null;
	private _recoverComponent: Component | null;

	public static get match(): QuantitySelector {
		return new Rule().directlyFollowedBy;
	}

	public static throw(message: string): Rule {
		return new Rule().throw(message);
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

	public recover(type: 'STRING' | 'REGEXP' | 'VARIANT', value: string): Rule {
		this._recoverComponent = Component.create(type, value, null, false, false);

		return this;
	}

	public throw(message: string): Rule {
		this._throwMessage = message;

		return this;
	}

	public capture(name: string): Rule {
		if (this._components.length === 0)
			return this;

		const lastComponent = this._components.pop()!;

		this._components.push(Component.create(lastComponent.type, lastComponent.value, name, lastComponent.greedy, lastComponent.optional));

		return this;
	}

	public get followedBy(): QuantitySelector {
		this._components.push(Component.create('REGEXP', /\s+/.source, null, false, false));

		return new QuantitySelector(this);
	}

	public get directlyFollowedBy(): QuantitySelector {
		return new QuantitySelector(this);
	}

	public toJSON(): RuleInterface {
		return {
			components: this._components.map(component => component.toJSON()),
			throwMessage: this._throwMessage,
			recoverComponent: this._recoverComponent ? this._recoverComponent.toJSON() : null
		};
	}
}

class ComponentSelector {
	private _ruleInstance: Rule;
	private _greedy: boolean;
	private _optional: boolean;

	public constructor(ruleInstance: Rule, greedy: boolean = false, optional: boolean = false) {
		this._ruleInstance = ruleInstance;
		this._greedy = greedy;
		this._optional = optional;
	}

	public string(string: string, name: string | null = null): Rule {
		this._ruleInstance.addComponent(Component.create('STRING', string, name, this._greedy, this._optional));

		return this._ruleInstance;
	}

	public regexp(regexp: RegExp, name: string | null = null): Rule {
		this._ruleInstance.addComponent(Component.create('REGEXP', regexp.source, name, this._greedy, this._optional));

		return this._ruleInstance;
	}

	public variant(variant: string, name: string | null = null): Rule {
		this._ruleInstance.addComponent(Component.create('VARIANT', variant, name, this._greedy, this._optional));

		return this._ruleInstance;
	}
}

class QuantitySelector {
	private _ruleInstance: Rule;

	public constructor(ruleInstance: Rule) {
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