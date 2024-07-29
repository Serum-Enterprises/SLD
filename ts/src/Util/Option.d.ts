import type { Result } from './Result';

export abstract class Option<T> {
	/**
	 * Create a new Some Variant
	 */
	static Some(value: T): Some<T>;
	/**
	 * Create a new None Variant
	 */
	static None(): None;

	/**
	 * Check if the Option is Some
	 */
	isSome(): this is Some<T>;
	/**
	 * Check if the Option is None
	 */
	isNone(): this is None;

	/**
	 * Check if the Option is Some and the value satisfies the given predicate
	 */
	isSomeAnd(predicate: (value: T) => true): this is Some<T>;
	isSomeAnd(predicate: (value: T) => false): false;
	isSomeAnd(predicate: (value: T) => boolean): boolean;

	/**
	 * Convert the Option to a Result
	 */
	toResult<E>(error: E): Result<T, E>;

	/**
	 * Expects the Result to be Ok, otherwise panics with the given Error Message
	 */
	expectSome(error: string): asserts this is Some<T>;
	/**
	 * Expects the Result to be Err, otherwise panics with the given Error Message
	 */
	expectNone(error: string): asserts this is None;

	/**
	 * Return the value of the Some Variant or the default Value
	 */
	expectSomeOr(defaultValue: T): T;

	/**
	 * Map Option<T> to Option<U> by applying a function
	 */
	mapSome<U>(fn: (value: T) => U): Option<U>;

	/**
	 * Match the Option
	 */
	match<R>(onSome: (value: T) => R, onNone: () => R): R;
}

/*
 * Represents a Some Variant of Option
 */
export class Some<T> extends Option<T> {
	/**
	 * Create a new Some Variant
	 */
	constructor(value: T);

	/**
	 * Get the value of the Some Variant
	 */
	get value(): T;
}

/*
 * Represents an None Variant of Option
 */
export class None extends Option<never> { }