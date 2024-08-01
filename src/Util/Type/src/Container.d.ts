import { AnyType } from './Any';

type AssertedType<T> = T extends (value: unknown) => asserts value is infer R ? R : never;

declare class InterfaceType<T extends { [key: string]: AnyType }> extends AnyType {
	/**
	 * Create a new Interface Type
	 */
	constructor(schema: T);

	/**
	 * Get the Type of this Interface Type
	 */
	get type(): T;

	/**
	 * Validate a value against this type
	 */
	validate(value: unknown, varName?: string): asserts value is {
		[K in keyof T]: T[K] extends AnyType ? AssertedType<T[K]['validate']> : never
	};
}

declare class ObjectType<T extends AnyType> extends AnyType {
	/**
	 * Create a new Object Type
	 */
	constructor(type: T);

	/**
	 * Get the Type of this Object Type
	 */
	get type(): T;

	/**
	 * Validate a value against this type
	 */
	validate(value: unknown, varName?: string): asserts value is Record<string | number | symbol, AssertedType<T['validate']>>;
}

declare class ArrayType<T extends AnyType> extends AnyType {
	/**
	 * Create a new Array Type
	 */
	constructor(type: T);

	/**
	 * Get the Type of this Array Type
	 */
	get type(): T;

	/**
	 * Validate a value against this type
	 */
	validate(value: unknown, varName?: string): asserts value is AssertedType<T['validate']>[];
}

declare class TupleType<T extends AnyType[]> extends AnyType {
	/**
	 * Create a new Tuple Type
	 */
	constructor(...types: T);

	/**
	 * Get the Type of this Tuple Type
	 */
	get types(): T;

	/**
	 * Validate a value against this type
	 */
	validate(value: unknown, varName?: string): asserts value is {
		[K in keyof T]: T[K] extends AnyType ? AssertedType<T[K]['validate']> : never
	};
}

export { InterfaceType, ObjectType, ArrayType, TupleType };