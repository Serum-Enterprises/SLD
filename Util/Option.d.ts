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
	 * Check if the Option is a Some Variant
	 */
	isSome(): this is Some<T>;
	/**
	 * Check if the Option is a None Variant
	 */
	isNone(): this is None;
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