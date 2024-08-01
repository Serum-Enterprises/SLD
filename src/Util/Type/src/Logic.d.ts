import { AnyType } from "./Any";

type AssertedType<T> = T extends (value: unknown) => asserts value is infer R ? R : never;
type Constructor<T> = new () => T;

declare class IntersectType<T extends AnyType[]> extends AnyType {
	/**
	 * Create a new Intersect Type
	 */
	constructor(...types: T);

	/**
	 * Get the Type of this Intersect Type
	 */
	get type(): T;

	/**
	 * Validate a value against this type
	 */
	validate(value: unknown, varName?: string): asserts value is {
		[K in keyof T]: T[K] extends AnyType ? AssertedType<T[K]['validate']> : never
	}[number];
}

declare class UnionType<T extends AnyType[]> extends AnyType {
	/**
	 * Create a new Union Type
	 */
	constructor(...types: T);

	/**
	 * Get the Type of this Union Type
	 */
	get type(): T;

	/**
	 * Validate a value against this type
	 */
	validate(value: unknown, varName?: string): asserts value is {
		[K in keyof T]: T[K] extends AnyType ? AssertedType<T[K]['validate']> : never
	}[number];
}

declare class InstanceOfType<T> extends AnyType {
	/**
	 * Create a new Instance Type
	 */
	constructor(constructorFunction: Constructor<T>, name: string);

	/**
	 * Get the Constructor Function of this Instance Type
	 */
	get constructorFunction(): Constructor<T>;

	/**
	 * Get the Name of this Instance Type
	 */
	get name(): string;

	/**
	 * Validate a value against this type
	 */
	validate(value: unknown, varName?: string): asserts value is T;
}

export { IntersectType, UnionType, InstanceOfType };