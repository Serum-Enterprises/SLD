export interface ComponentInterface {
	type: 'STRING' | 'REGEXP' | 'VARIANT';
	value: string;
	name: string | null;
	greedy: boolean;
	optional: boolean;
}

export class Component {
	private _type: 'STRING' | 'REGEXP' | 'VARIANT';
	private _value: string;
	private _name: string | null;
	private _greedy: boolean;
	private _optional: boolean;

	public static create(type: 'STRING' | 'REGEXP' | 'VARIANT', value: string, name: string | null = null, greedy: boolean = false, optional: boolean = false) {
		return new Component(type, value, name, greedy, optional);
	}

	public constructor(type: 'STRING' | 'REGEXP' | 'VARIANT', value: string, name: string | null = null, greedy: boolean = false, optional: boolean = false) {
		this._type = type;
		this._value = value;
		this._name = name;
		this._greedy = greedy;
		this._optional = optional;
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

	public get greedy(): boolean {
		return this._greedy;
	}

	public get optional(): boolean {
		return this._optional;
	}

	public toJSON(): ComponentInterface {
		return {
			type: this._type,
			value: this._value,
			name: this._name,
			greedy: this._greedy,
			optional: this._optional
		};
	}
}