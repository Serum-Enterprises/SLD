"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.None = exports.Some = exports.Option = void 0;
const Result_1 = require("./Result");
const panic_1 = require("./panic");
class Option {
    /**
     * Create a new Some Variant
     */
    static Some(value) {
        return new Some(value);
    }
    /**
     * Create a new None Variant
     */
    static None() {
        return new None();
    }
    /**
     * Get the constructor of the Option Variant
     */
    is() {
        return this.constructor;
    }
    /**
     * Check if the Option is Some
     */
    isSome() {
        return this instanceof Some;
    }
    /**
     * Check if the Option is None
     */
    isNone() {
        return this instanceof None;
    }
    isSomeAnd(predicate) {
        return (this instanceof Some) && predicate(this.value);
    }
    /**
     * Convert the Option to a Result
     */
    toResult(error) {
        return (this instanceof Some) ? Result_1.Result.Ok(this.value) : Result_1.Result.Err(error);
    }
    /**
     * Expects the Result to be Ok, otherwise panics with the given Error Message
     */
    expectSome(error) {
        if (!(this instanceof Some))
            (0, panic_1.panic)(error);
    }
    /**
     * Expects the Result to be Err, otherwise panics with the given Error Message
     */
    expectNone(error) {
        if (!(this instanceof None))
            (0, panic_1.panic)(error);
    }
    /**
     * Return the value of the Some Variant or the default Value
     */
    expectSomeOr(defaultValue) {
        return (this instanceof Some) ? this.value : defaultValue;
    }
    /**
     * Map Option<T> to Option<U> by applying a function
     */
    mapSome(fn) {
        return (this instanceof Some) ? new Some(fn(this.value)) : new None();
    }
    /**
     * Match the Option
     */
    match(onSome, onNone) {
        return (this instanceof Some) ? onSome(this.value) : onNone();
    }
}
exports.Option = Option;
/*
 * Represents a Some Variant of Option
 */
class Some extends Option {
    _value;
    /**
     * Create a new Some Variant
     */
    constructor(value) {
        super();
        this._value = value;
    }
    /**
     * Get the value of the Some Variant
     */
    get value() {
        return this._value;
    }
}
exports.Some = Some;
/*
 * Represents an None Variant of Option
 */
class None extends Option {
}
exports.None = None;
