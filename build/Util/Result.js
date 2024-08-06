"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Err = exports.Ok = exports.Result = void 0;
const Option_1 = require("./Option");
const panic_1 = require("./panic");
class Result {
    /**
     * Create a new Ok Variant
     */
    static Ok(value) {
        return new Ok(value);
    }
    /**
     * Create a new Err Variant
     */
    static Err(error) {
        return new Err(error);
    }
    /**
     * Get the constructor of the Result Variant
     */
    is() {
        return this.constructor;
    }
    /**
     * Check if the Result is Ok
     */
    isOk() {
        return (this instanceof Ok);
    }
    /**
     * Check if the Result is Err
     */
    isErr() {
        return (this instanceof Err);
    }
    isOkAnd(predicate) {
        return (this instanceof Ok) && predicate(this.value);
    }
    isErrAnd(predicate) {
        return (this instanceof Err) && predicate(this.error);
    }
    /**
     * Convert the Result to an Option
     */
    OkToOption() {
        return (this instanceof Ok) ? Option_1.Option.Some(this.value) : Option_1.Option.None();
    }
    ErrToOption() {
        return (this instanceof Err) ? Option_1.Option.Some(this.error) : Option_1.Option.None();
    }
    /**
     * Expects the Result to be Ok, otherwise panics with the given Error Message
     */
    expectOk(error) {
        if (!(this instanceof Ok))
            (0, panic_1.panic)(error);
    }
    /**
     * Expects the Result to be Err, otherwise panics with the given Error Message
     */
    expectErr(error) {
        if (!(this instanceof Err))
            (0, panic_1.panic)(error);
    }
    /**
     * Return the value of the Ok Variant or the default Value
     */
    expectOkOr(defaultValue) {
        return (this instanceof Ok) ? this.value : defaultValue;
    }
    /**
     * Return the error of the Err Variant or the default Value
     */
    expectErrOr(defaultValue) {
        return (this instanceof Err) ? this.error : defaultValue;
    }
    /**
     * Map Result<T, E> to Result<U, E> by applying a function
     */
    mapOk(fn) {
        return (this instanceof Ok) ? Result.Ok(fn(this.value)) : Result.Err(this.error);
    }
    /**
     * Map Result<T, E> to Result<T, F> by applying a function
     */
    mapErr(fn) {
        return (this instanceof Err) ? Result.Err(fn(this.error)) : Result.Ok(this.value);
    }
    /**
     * Match the Result
     */
    match(onOk, onErr) {
        return (this instanceof Ok) ? onOk(this.value) : onErr(this.error);
    }
}
exports.Result = Result;
/*
 * Represents an Ok Variant of Result
 */
class Ok extends Result {
    _value;
    /**
     * Create a new Ok Result
     */
    constructor(value) {
        super();
        this._value = value;
    }
    /**
     * Get the value of the Ok Result
     */
    get value() {
        return this._value;
    }
}
exports.Ok = Ok;
/*
 * Represents an Err Variant of Result
 */
class Err extends Result {
    _error;
    /**
     * Create a new Err Result
     */
    constructor(error) {
        super();
        this._error = error;
    }
    /**
     * Get the error of the Err Result
     */
    get error() {
        return this._error;
    }
}
exports.Err = Err;
