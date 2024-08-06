import { Result } from './Result';
export declare abstract class Option<T> {
    /**
     * Create a new Some Variant
     */
    static Some<T>(value: T): Some<T>;
    /**
     * Create a new None Variant
     */
    static None(): None;
    /**
     * Get the constructor of the Option Variant
     */
    is(): typeof Some<T> | typeof None;
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
    expectNone(error: string): asserts this is None | never;
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
export declare class Some<T> extends Option<T> {
    private _value;
    /**
     * Create a new Some Variant
     */
    constructor(value: T);
    /**
     * Get the value of the Some Variant
     */
    get value(): T;
}
export declare class None extends Option<never> {
}
