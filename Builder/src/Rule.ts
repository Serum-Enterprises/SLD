import { BaseComponentInterface, ComponentSetInterface } from "./Component";
import { BaseComponent, ComponentSet } from "./Component";

export interface RuleInterface {
	components: ComponentSetInterface[];
	throwMessage: string | null;
	recoverComponent: BaseComponentInterface | null;
}

export class Rule {
	private _components: ComponentSet[];
	private _throwMessage: string | null;
	private _recoverComponent: BaseComponent | null;

	public static get match(): QuantitySelector {
		return new Rule().directlyFollowedBy;
	}

	public static throw(message: string): Rule {
		return new Rule().throw(message);
	}

	public constructor(components: ComponentSet[] = [], throwMessage: string | null = null, recoverComponent: BaseComponent | null = null) {
		this._components = components;
		this._throwMessage = throwMessage;
		this._recoverComponent = recoverComponent;
	}

	public addComponentSet(componentSet: ComponentSet): Rule {
		this._components.push(componentSet);

		return this;
	}

	public recover(type: 'STRING' | 'REGEXP', value: string): Rule {
		this._recoverComponent = BaseComponent.create(type, value);

		return this;
	}

	public throw(message: string): Rule {
		this._throwMessage = message;

		return this;
	}

	public get followedBy(): QuantitySelector {
		const wsComponent = BaseComponent.create('REGEXP', /^\s+/.source);
		return new QuantitySelector(this, [wsComponent]);
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
	private _componentList: BaseComponent[] | null;

	public constructor(ruleInstance: Rule, componentList: BaseComponent[] | null = null) {
		this._ruleInstance = ruleInstance;
		this._componentList = componentList;
	}

	public get one(): ComponentSelector {
		return new ComponentSelector(this._ruleInstance, this._componentList, false, false);
	}

	public get zeroOrOne(): ComponentSelector {
		return new ComponentSelector(this._ruleInstance, this._componentList, false, true);
	}

	public get zeroOrMore(): ComponentSelector {
		return new ComponentSelector(this._ruleInstance, this._componentList, true, true);
	}

	public get oneOrMore(): ComponentSelector {
		return new ComponentSelector(this._ruleInstance, this._componentList, true, false);
	}
}

class ComponentSelector {
	private _ruleInstance: Rule;
	private _componentList: BaseComponent[] | null;
	private _greedy: boolean;
	private _optional: boolean;

	public constructor(ruleInstance: Rule, componentList: BaseComponent[] | null = null, greedy: boolean = false, optional: boolean = false) {
		this._ruleInstance = ruleInstance;
		this._componentList = componentList;
		this._greedy = greedy;
		this._optional = optional;
	}

	public string(string: string, name: string | null = null): Rule {
		this._ruleInstance.addComponentSet(ComponentSet.create([
			...this._componentList === null ? [] : this._componentList,
			BaseComponent.create('STRING', string, name)
		], this._greedy, this._optional));

		return this._ruleInstance;
	}

	public regexp(regexp: RegExp, name: string | null = null): Rule {
		this._ruleInstance.addComponentSet(ComponentSet.create([
			...this._componentList === null ? [] : this._componentList,
			BaseComponent.create('REGEXP', regexp.source.startsWith('^') ? regexp.source : `^${regexp.source}`, name)
		], this._greedy, this._optional));

		return this._ruleInstance;
	}

	public variant(variant: string, name: string | null = null): Rule {
		this._ruleInstance.addComponentSet(ComponentSet.create([
			...this._componentList === null ? [] : this._componentList,
			BaseComponent.create('VARIANT', variant, name)
		], this._greedy, this._optional));

		return this._ruleInstance;
	}

	public whitespace(name: string | null = null): Rule {
		this._ruleInstance.addComponentSet(ComponentSet.create([
			...this._componentList === null ? [] : this._componentList,
			BaseComponent.create('REGEXP', /^\s/.source, name)
		], this._greedy, this._optional));

		return this._ruleInstance;
	}
}

