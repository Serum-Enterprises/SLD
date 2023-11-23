export interface BaseComponentInterface {
	type: 'STRING' | 'REGEXP' | 'VARIANT';
	value: string;
	name: string | null;
}

export interface ComponentSetInterface {
	components: BaseComponentInterface[];
	greedy: boolean;
	optional: boolean;
}

export class BaseComponent {
	private _type: 'STRING' | 'REGEXP' | 'VARIANT';
	private _value: string;
	private _name: string | null;

	public static create(type: 'STRING' | 'REGEXP' | 'VARIANT', value: string, name: string | null = null) {
		return new BaseComponent(type, value, name);
	}

	public constructor(type: 'STRING' | 'REGEXP' | 'VARIANT', value: string, name: string | null = null) {
		this._type = type;
		this._value = value;
		this._name = name;
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

	public toJSON(): BaseComponentInterface {
		return {
			type: this._type,
			value: this._value,
			name: this._name
		};
	}
}

export class ComponentSet {
	private _components: BaseComponent[];
	private _optional: boolean;
	private _greedy: boolean;

	public static create(components: BaseComponent[], greedy: boolean = false, optional: boolean = false) {
		return new ComponentSet(components, greedy, optional);
	}

	public constructor(components: BaseComponent[], greedy: boolean = false, optional: boolean = false) {
		this._components = components;
		this._optional = optional;
		this._greedy = greedy;
	}

	public get components(): BaseComponent[] {
		return this._components;
	}

	public get optional(): boolean {
		return this._optional;
	}

	public get greedy(): boolean {
		return this._greedy;
	}

	public toJSON(): ComponentSetInterface {
		return {
			components: this._components.map((component) => component.toJSON()),
			optional: this._optional,
			greedy: this._greedy
		};
	}
}