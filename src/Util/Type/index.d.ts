import { AnyType } from './Types/Any';
import { NullishType, UndefinedType, NullType, BooleanType, NumberType, InfinityType, NaNType, NumericType, IntegerType, StringType } from './Types/Primitive';
import { InterfaceType, ObjectType, ArrayType, TupleType } from './Types/Container';
import { IntersectType, UnionType, InstanceOfType } from './Types/Logic';

declare class Type {
	/**
	 * Create a new Any Type Validator
	 */
	static get Any(): AnyType;

	/**
	 * Create a new Undefined Type Validator
	 */
	static get Undefined(): UndefinedType;

	/**
	 * Create a new Null Type Validator
	 */
	static get Null(): NullType;

	/**
	 * Create a new Nullish Type Validator
	 */
	static get Nullish(): NullishType;

	/**
	 * Create a new Boolean Type Validator
	 */
	static get Boolean(): BooleanType;

	/**
	 * Create a new Number Type Validator
	 */
	static get Number(): NumberType;

	/**
	 * Create a new NaN Type Validator
	 */
	static get NaN(): NaNType;

	/**
	 * Create a new Infinity Type Validator
	 */
	static get Infinity(): InfinityType;

	/**
	 * Create a new Numeric Type Validator
	 */
	static get Numeric(): NumericType;

	/**
	 * Create a new Integer Type Validator
	 */
	static get Integer(): IntegerType;

	/**
	 * Create a new String Type Validator
	 */
	static get String(): StringType;

	/**
	 * Create a new Tuple Type Validator
	 */
	static Tuple<T extends AnyType[]>(...types: T): TupleType<T>;

	/**
	 * Create a new Array Type Validator
	 */
	static Array<T extends AnyType>(type: T): ArrayType<T>;

	/**
	 * Create a new Interface Type Validator
	 */
	static Interface<T extends { [key: string]: AnyType }>(schema: T): InterfaceType<T>;

	/**
	 * Create a new Object Type Validator
	 */
	static Object<T extends AnyType>(type: T): ObjectType<T>;

	/**
	 * Create a new Union Type Validator
	 */
	static Union<T extends AnyType[]>(...types: T): UnionType<T>;

	/**
	 * Create a new Intersect Type Validator
	 */
	static Intersect<T extends AnyType[]>(...types: T): IntersectType<T>;

	/**
	 * Create a new Instance Type Validator
	 */
	static InstanceOf<T>(constructorFunction: T, name: string): InstanceOfType<T>;
}



export {
	Type,
	AnyType,
	NullishType,
	UndefinedType,
	NullType,
	BooleanType,
	NumberType,
	InfinityType,
	NaNType,
	NumericType,
	IntegerType,
	StringType,
	InterfaceType,
	ObjectType,
	ArrayType,
	TupleType,
	IntersectType,
	UnionType,
	InstanceOfType
};