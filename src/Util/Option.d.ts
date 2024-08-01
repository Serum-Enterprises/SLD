export abstract class Option<T> {
	/**
	 * Get the Some Variant of Option
	 */
	static get Some(): typeof Some;
	/**
	 * Get the None Variant of Option
	 */
	static get None(): typeof None;

	/**
	 * Returns the constructor for the Option Variant
	 */
	is(): typeof this;

	/**
	 * Check if the Option is a Some Variant
	 */
	isSome(): this is Some<T>;
	/**
	 * Check if the Option is a None Variant
	 */
	isNone(): this is None;

	/**
	 * Expects the Option to be Some, otherwise throws the given error
	 */
	expectSome<M>(error: M): asserts this is Some<T>;
	/**
	 * Expects the Option to be None, otherwise throws the given error
	 */
	expectNone<M>(error: M): asserts this is None;

	/**
	 * Unwrap the Result or throw the Error
	 */
	unwrap<E>(error: E): T;
	/**
	 * Unwrap the Result or return a default value
	 */
	unwrapOr(defaultValue: T): T;
	/**
	 * Map Result<T, E> to Result<U, E> by applying a function
	 */
	map<U>(fn: (value: T) => U): Option<U>;

	/**
	 * Match the Option
	 */
	match<R>(onSome: (value: T) => R, onNone: () => R): R;
}

/**
 * Represents a Some Variant of Option
 */
declare class Some<T> extends Option<T> {
	/**
	 * Create a new Some Variant of Option
	 */
	constructor(value: T);

	/**
	 * Get the value of the Some Variant
	 */
	get value(): T;
}

/**
 * Represents a None Variant of Option
 */
declare class None extends Option<never> { }