import { ComponentInterface, PrefixComponentInterface, RecoverComponentInterface } from "./Component";
import { Component, PrefixComponent, RecoverComponent } from "./Component";

export interface RuleInterface {
	components: ComponentInterface[];
	throwMessage: string | null;
	recoverComponent: RecoverComponentInterface | null;
}

export class Rule {
	private _components: Component[];
	private _throwMessage: string | null;
	private _recoverComponent: RecoverComponent | null;

	public static get match(): QuantitySelector {
		return new Rule().directlyFollowedBy;
	}

	public static throw(message: string): Rule {
		return new Rule().throw(message);
	}

	public constructor(components: Component[] = [], throwMessage: string | null = null, recoverComponent: RecoverComponent | null = null) {
		this._components = components;
		this._throwMessage = throwMessage;
		this._recoverComponent = recoverComponent;
	}

	public addComponent(component: Component): Rule {
		this._components.push(component);

		return this;
	}

	public recover(type: 'STRING' | 'REGEXP', value: string): Rule {
		this._recoverComponent = RecoverComponent.create(type, value);

		return this;
	}

	public throw(message: string): Rule {
		this._throwMessage = message;

		return this;
	}

	public prefix(prefix: PrefixComponent): Rule {
		if (this._components.length === 0)
			return this;

		const lastComponent = this._components.pop()!;

		this._components.push(Component.create(lastComponent.type, lastComponent.value, lastComponent.name, lastComponent.greedy, lastComponent.optional, prefix));

		return this;
	}

	public capture(name: string): Rule {
		if (this._components.length === 0)
			return this;

		const lastComponent = this._components.pop()!;

		this._components.push(Component.create(lastComponent.type, lastComponent.value, name, lastComponent.greedy, lastComponent.optional, lastComponent.prefix));

		return this;
	}

	public get followedBy(): QuantitySelector {
		return new QuantitySelector(this, PrefixComponent.create('REGEXP', /\s*/.source, false));
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

class QuantitySelector {
	private _ruleInstance: Rule;
	private _prefix: PrefixComponent | null;

	public constructor(ruleInstance: Rule, prefix: PrefixComponent | null = null) {
		this._ruleInstance = ruleInstance;
		this._prefix = prefix;
	}

	public get one(): ComponentSelector {
		return new ComponentSelector(this._ruleInstance, this._prefix, false, false);
	}

	public get zeroOrOne(): ComponentSelector {
		return new ComponentSelector(this._ruleInstance, this._prefix, false, true);
	}

	public get zeroOrMore(): ComponentSelector {
		return new ComponentSelector(this._ruleInstance, this._prefix, true, true);
	}

	public get oneOrMore(): ComponentSelector {
		return new ComponentSelector(this._ruleInstance, this._prefix, true, false);
	}
}

class ComponentSelector {
	private _ruleInstance: Rule;
	private _prefix: PrefixComponent | null;
	private _greedy: boolean;
	private _optional: boolean;

	public constructor(ruleInstance: Rule, prefix: PrefixComponent | null, greedy: boolean = false, optional: boolean = false) {
		this._ruleInstance = ruleInstance;
		this._prefix = prefix;
		this._greedy = greedy;
		this._optional = optional;
	}

	public string(string: string, name: string | null = null): Rule {
		this._ruleInstance.addComponent(Component.create('STRING', string, name, this._greedy, this._optional, this._prefix));

		return this._ruleInstance;
	}

	public regexp(regexp: RegExp, name: string | null = null): Rule {
		this._ruleInstance.addComponent(Component.create('REGEXP', regexp.source, name, this._greedy, this._optional, this._prefix));

		return this._ruleInstance;
	}

	public variant(variant: string, name: string | null = null): Rule {
		this._ruleInstance.addComponent(Component.create('VARIANT', variant, name, this._greedy, this._optional, this._prefix));

		return this._ruleInstance;
	}

	public whitespace(name: string | null = null): Rule {
		this._ruleInstance.addComponent(Component.create('REGEXP', /\s/.source, name, this._greedy, this._optional, this._prefix));

		return this._ruleInstance;
	}
}

