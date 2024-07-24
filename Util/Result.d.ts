export abstract class Result<T, E> {
	/**
	 * Get the Ok Variant of Result
	 */
	static get Ok(): typeof Ok;
	/**
	 * Get the Err Variant of Result
	 */
	static get Err(): typeof Err;

	/**
	 * Returns the constructor for the Result Variant
	 */
	is(): typeof this;

	/**
	 * Check if the Result is Ok
	 */
	isOk(): this is Ok<T>;
	/**
	 * Check if the Result is Err
	 */
	isErr(): this is Err<E>;

	/**
	 * Expects the Result to be Ok, otherwise throws the given error
	 */
	expectOk<M>(error: M): asserts this is Ok<T>;
	/**
	 * Expects the Result to be Err, otherwise throws the given error
	 */
	expectErr<M>(error: M): asserts this is Err<E>;

	/**
	 * Unwrap the Result or throw the Error
	 */
	unwrap(): T;

	/**
	 * Unwrap the Result or throw the Error
	 */
	unwrap(): T;

	/**
	 * Unwrap the Result or return a default value
	 */
	unwrapOr(defaultValue: T): T;

	/**
	 * Map Result<T, E> to Result<U, E> by applying a function
	 */
	map<U>(fn: (value: T) => U): Result<U, E>;

	/**
	 * Match the Result
	 */
	match<R>(onOk: (value: T) => R, onErr: (error: E) => R): R;
}

/*
 * Represents an Ok Variant of Result
 */
declare class Ok<T> extends Result<T, never> {
	/**
	 * Create a new Ok Result
	 */
	constructor(value: T);

	/**
	 * Get the value of the Ok Result
	 */
	get value(): T;
}

/*
 * Represents an Err Variant of Result
 */
declare class Err<E> extends Result<never, E> {
	/**
	 * Create a new Err Result
	 */
	constructor(error: E);

	/**
	 * Get the error of the Err Result
	 */
	get error(): E;
}