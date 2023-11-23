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

export interface RecoverComponentInterface {
	type: 'STRING' | 'REGEXP';
	value: string;
}

export interface PrefixComponentInterface {
	type: 'STRING' | 'REGEXP';
	value: string;
	include: boolean;
}

export interface ComponentInterface {
	type: 'STRING' | 'REGEXP' | 'VARIANT';
	value: string;
	name: string | null;
	optional: boolean;
	greedy: boolean;
	prefix: PrefixComponentInterface | null;
}

export class RecoverComponent {
	private _type: 'STRING' | 'REGEXP';
	private _value: string;

	public static create(type: 'STRING' | 'REGEXP', value: string) {
		return new RecoverComponent(type, value);
	}

	public constructor(type: 'STRING' | 'REGEXP', value: string) {
		this._type = type;
		this._value = value;
	}

	public get type(): 'STRING' | 'REGEXP' {
		return this._type;
	}

	public get value(): string {
		return this._value;
	}

	public toJSON(): RecoverComponentInterface {
		return {
			type: this._type,
			value: this._value,
		};
	}
}

export class PrefixComponent {
	private _type: 'STRING' | 'REGEXP';
	private _value: string;
	private _include: boolean;

	public static create(type: 'STRING' | 'REGEXP', value: string, include: boolean) {
		return new PrefixComponent(type, value, include);
	}

	public constructor(type: 'STRING' | 'REGEXP', value: string, include: boolean) {
		this._type = type;
		this._value = value;
		this._include = include;
	}

	public get type(): 'STRING' | 'REGEXP' {
		return this._type;
	}

	public get value(): string {
		return this._value;
	}

	public get include(): boolean {
		return this._include;
	}

	public toJSON(): PrefixComponentInterface {
		return {
			type: this._type,
			value: this._value,
			include: this._include,
		};
	}
}

export class Component {
	private _type: 'STRING' | 'REGEXP' | 'VARIANT';
	private _value: string;
	private _name: string | null;
	private _optional: boolean;
	private _greedy: boolean;
	private _prefix: PrefixComponent | null;

	public static create(type: 'STRING' | 'REGEXP' | 'VARIANT', value: string, name: string | null = null, greedy: boolean = false, optional: boolean = false, prefix: PrefixComponent | null = null) {
		return new Component(type, value, name, greedy, optional, prefix);
	}

	public constructor(type: 'STRING' | 'REGEXP' | 'VARIANT', value: string, name: string | null = null, greedy: boolean = false, optional: boolean = false, prefix: PrefixComponent | null = null) {
		this._type = type;
		this._value = value;
		this._name = name;
		this._optional = optional;
		this._greedy = greedy;
		this._prefix = prefix;
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

	public get optional(): boolean {
		return this._optional;
	}

	public get greedy(): boolean {
		return this._greedy;
	}

	public get prefix(): PrefixComponent | null {
		return this._prefix;
	}

	public toJSON(): ComponentInterface {
		return {
			type: this._type,
			value: this._value,
			name: this._name,
			optional: this._optional,
			greedy: this._greedy,
			prefix: this._prefix ? this._prefix.toJSON() : null,
		};
	}
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