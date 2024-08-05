import { Result } from './Result';
import { panic } from './panic';

export abstract class Option<T> {
	/**
	 * Create a new Some Variant
	 */
	static Some<T>(value: T): Some<T> {
		return new Some(value);
	}
	/**
	 * Create a new None Variant
	 */
	static None(): None {
		return new None();
	}

	/**
	 * Get the constructor of the Option Variant
	 */
	is(): typeof Some<T> | typeof None {
		return this.constructor as typeof Some<T> | typeof None;
	}

	/**
	 * Check if the Option is Some
	 */
	isSome(): this is Some<T> {
		return this instanceof Some;
	}
	/**
	 * Check if the Option is None
	 */
	isNone(): this is None {
		return this instanceof None;
	}

	/**
	 * Check if the Option is Some and the value satisfies the given predicate
	 */
	isSomeAnd(predicate: (value: T) => true): this is Some<T>;
	isSomeAnd(predicate: (value: T) => false): false;
	isSomeAnd(predicate: (value: T) => boolean): boolean;
	isSomeAnd(predicate: (value: T) => boolean): boolean {
		return (this instanceof Some) && predicate(this.value);
	}

	/**
	 * Convert the Option to a Result
	 */
	toResult<E>(error: E): Result<T, E> {
		return (this instanceof Some) ? Result.Ok(this.value) : Result.Err(error);
	}

	/**
	 * Expects the Result to be Ok, otherwise panics with the given Error Message
	 */
	expectSome(error: string): asserts this is Some<T> {
		if (!(this instanceof Some))
			panic(error);
	}
	/**
	 * Expects the Result to be Err, otherwise panics with the given Error Message
	 */
	expectNone(error: string): asserts this is None | never {
		if (!(this instanceof None))
			panic(error);
	}

	/**
	 * Return the value of the Some Variant or the default Value
	 */
	expectSomeOr(defaultValue: T): T {
		return (this instanceof Some) ? this.value : defaultValue;
	}

	/**
	 * Map Option<T> to Option<U> by applying a function
	 */
	mapSome<U>(fn: (value: T) => U): Option<U> {
		return (this instanceof Some) ? new Some(fn(this.value)) : new None();
	}

	/**
	 * Match the Option
	 */
	match<R>(onSome: (value: T) => R, onNone: () => R): R {
		return (this instanceof Some) ? onSome(this.value) : onNone();
	}
}

/*
 * Represents a Some Variant of Option
 */
export class Some<T> extends Option<T> {
	private _value: T;

	/**
	 * Create a new Some Variant
	 */
	constructor(value: T) {
		super();
		this._value = value;
	}

	/**
	 * Get the value of the Some Variant
	 */
	get value(): T {
		return this._value;
	}
}

/*
 * Represents an None Variant of Option
 */
export class None extends Option<never> { }