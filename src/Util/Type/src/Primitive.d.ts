import { AnyType } from './Any';

declare class NullishType extends AnyType {
	validate(value: unknown, varName?: string): asserts value is undefined | null;
}
declare class UndefinedType extends NullishType {
	validate(value: unknown, varName?: string): asserts value is undefined;
}
declare class NullType extends NullishType {
	validate(value: unknown, varName?: string): asserts value is null;
}

declare class BooleanType extends AnyType {
	validate(value: unknown, varName?: string): asserts value is boolean;
}

declare class NumberType extends AnyType {
	validate(value: unknown, varName?: string): asserts value is number;
}

declare class InfinityType extends NumberType {
	validate(value: unknown, varName?: string): asserts value is number;
}

declare class NaNType extends NumberType {
	validate(value: unknown, varName?: string): asserts value is number;
}

declare class NumericType extends NumberType {
	validate(value: unknown, varName?: string): asserts value is number;
}

declare class IntegerType extends NumericType {
	validate(value: unknown, varName?: string): asserts value is number;
}

declare class StringType extends AnyType {
	validate(value: unknown, varName?: string): asserts value is string;
}

export {
	NullishType,
	UndefinedType,
	NullType,
	BooleanType,
	NumberType,
	InfinityType,
	NaNType,
	NumericType,
	IntegerType,
	StringType
};