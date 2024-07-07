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
	 * Check if the Result is Ok
	 */
	isOk(): this is Ok<T>;

	/**
	 * Check if the Result is Err
	 */
	isErr(): this is Err<E>;
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