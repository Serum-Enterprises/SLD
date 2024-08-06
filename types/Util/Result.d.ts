import { Option } from './Option';
export declare abstract class Result<T, E> {
    /**
     * Create a new Ok Variant
     */
    static Ok<T>(value: T): Ok<T>;
    /**
     * Create a new Err Variant
     */
    static Err<E>(error: E): Err<E>;
    /**
     * Get the constructor of the Result Variant
     */
    is(): typeof Ok<T> | typeof Err<E>;
    /**
     * Check if the Result is Ok
     */
    isOk(): this is Ok<T>;
    /**
     * Check if the Result is Err
     */
    isErr(): this is Err<E>;
    /**
     * Check if the Result is Ok and the value satisfies the given predicate
     */
    isOkAnd(predicate: (value: T) => true): this is Ok<T>;
    isOkAnd(predicate: (value: T) => false): false;
    isOkAnd(predicate: (value: T) => boolean): boolean;
    /**
     * Check if the Result is Err and the error satisfies the given predicate
     */
    isErrAnd(predicate: (error: E) => true): this is Err<E>;
    isErrAnd(predicate: (error: E) => false): false;
    isErrAnd(predicate: (error: E) => boolean): boolean;
    /**
     * Convert the Result to an Option
     */
    OkToOption(): Option<T>;
    ErrToOption(): Option<E>;
    /**
     * Expects the Result to be Ok, otherwise panics with the given Error Message
     */
    expectOk(error: string): asserts this is Ok<T>;
    /**
     * Expects the Result to be Err, otherwise panics with the given Error Message
     */
    expectErr(error: string): asserts this is Err<E>;
    /**
     * Return the value of the Ok Variant or the default Value
     */
    expectOkOr(defaultValue: T): T;
    /**
     * Return the error of the Err Variant or the default Value
     */
    expectErrOr(defaultValue: E): E;
    /**
     * Map Result<T, E> to Result<U, E> by applying a function
     */
    mapOk<U>(fn: (value: T) => U): Result<U, E>;
    /**
     * Map Result<T, E> to Result<T, F> by applying a function
     */
    mapErr<F>(fn: (error: E) => F): Result<T, F>;
    /**
     * Match the Result
     */
    match<R>(onOk: (value: T) => R, onErr: (error: E) => R): R;
}
export declare class Ok<T> extends Result<T, never> {
    private _value;
    /**
     * Create a new Ok Result
     */
    constructor(value: T);
    /**
     * Get the value of the Ok Result
     */
    get value(): T;
}
export declare class Err<E> extends Result<never, E> {
    private _error;
    /**
     * Create a new Err Result
     */
    constructor(error: E);
    /**
     * Get the error of the Err Result
     */
    get error(): E;
}
