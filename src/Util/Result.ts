import { Option } from './Option';
import { panic } from './panic';

export abstract class Result<T, E> {
	/**
	 * Create a new Ok Variant
	 */
	static Ok<T>(value: T): Ok<T> {
		return new Ok(value);
	}
	/**
	 * Create a new Err Variant
	 */
	static Err<E>(error: E): Err<E> {
		return new Err(error);
	}

	/**
	 * Get the constructor of the Result Variant
	 */
	is(): typeof Ok<T> | typeof Err<E> {
		return this.constructor as typeof Ok<T> | typeof Err<E>;
	}

	/**
	 * Check if the Result is Ok
	 */
	isOk(): this is Ok<T> {
		return (this instanceof Ok);
	}
	/**
	 * Check if the Result is Err
	 */
	isErr(): this is Err<E> {
		return (this instanceof Err);
	}

	/**
	 * Check if the Result is Ok and the value satisfies the given predicate
	 */
	isOkAnd(predicate: (value: T) => true): this is Ok<T>;
	isOkAnd(predicate: (value: T) => false): false;
	isOkAnd(predicate: (value: T) => boolean): boolean;
	isOkAnd(predicate: (value: T) => boolean): boolean {
		return (this instanceof Ok) && predicate(this.value);
	}

	/**
	 * Check if the Result is Err and the error satisfies the given predicate
	 */
	isErrAnd(predicate: (error: E) => true): this is Err<E>;
	isErrAnd(predicate: (error: E) => false): false;
	isErrAnd(predicate: (error: E) => boolean): boolean;
	isErrAnd(predicate: (error: E) => boolean): boolean {
		return (this instanceof Err) && predicate(this.error);
	}

	/**
	 * Convert the Result to an Option
	 */
	OkToOption(): Option<T> {
		return (this instanceof Ok) ? Option.Some(this.value) : Option.None();
	}
	ErrToOption(): Option<E> {
		return (this instanceof Err) ? Option.Some(this.error) : Option.None();
	}

	/**
	 * Expects the Result to be Ok, otherwise panics with the given Error Message
	 */
	expectOk(error: string): asserts this is Ok<T> {
		if (!(this instanceof Ok))
			panic(error);
	}
	/**
	 * Expects the Result to be Err, otherwise panics with the given Error Message
	 */
	expectErr(error: string): asserts this is Err<E> {
		if (!(this instanceof Err))
			panic(error);
	}

	/**
	 * Return the value of the Ok Variant or the default Value
	 */
	expectOkOr(defaultValue: T): T {
		return (this instanceof Ok) ? this.value : defaultValue;
	}
	/**
	 * Return the error of the Err Variant or the default Value
	 */
	expectErrOr(defaultValue: E): E {
		return (this instanceof Err) ? this.error : defaultValue;
	}

	/**
	 * Map Result<T, E> to Result<U, E> by applying a function
	 */
	mapOk<U>(fn: (value: T) => U): Result<U, E> {
		return (this instanceof Ok) ? Result.Ok(fn((this as Ok<T>).value)) : Result.Err((this as unknown as Err<E>).error);
	}
	/**
	 * Map Result<T, E> to Result<T, F> by applying a function
	 */
	mapErr<F>(fn: (error: E) => F): Result<T, F> {
		return (this instanceof Err) ? Result.Err(fn((this as Err<E>).error)) : Result.Ok((this as unknown as Ok<T>).value);
	}

	/**
	 * Match the Result
	 */
	match<R>(onOk: (value: T) => R, onErr: (error: E) => R): R {
		return (this instanceof Ok) ? onOk((this as Ok<T>).value) : onErr((this as unknown as Err<E>).error);
	}
}

/*
 * Represents an Ok Variant of Result
 */
export class Ok<T> extends Result<T, never> {
	private _value: T;

	/**
	 * Create a new Ok Result
	 */
	constructor(value: T) {
		super();
		this._value = value;
	}

	/**
	 * Get the value of the Ok Result
	 */
	get value(): T {
		return this._value;
	}
}

/*
 * Represents an Err Variant of Result
 */
export class Err<E> extends Result<never, E> {
	private _error: E;

	/**
	 * Create a new Err Result
	 */
	constructor(error: E) {
		super();
		this._error = error;
	}

	/**
	 * Get the error of the Err Result
	 */
	get error(): E {
		return this._error;
	}
}