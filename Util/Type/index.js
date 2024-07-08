const { AnyType } = require('./src/Any');
const { NullishType, UndefinedType, NullType, BooleanType, NumberType, InfinityType, NaNType, NumericType, IntegerType, StringType } = require('./src/Primitive');
const { InterfaceType, ObjectType, ArrayType, TupleType } = require('./src/Container');
const { IntersectType, UnionType, InstanceType } = require('./src/Logic');

class Type {
	static get Any() {
		return new AnyType();
	}

	static get Undefined() {
		return new UndefinedType();
	}

	static get Null() {
		return new NullType();
	}

	static get Nullish() {
		return new NullishType();
	}

	static get Boolean() {
		return new BooleanType();
	}

	static get Number() {
		return new NumberType();
	}

	static get NaN() {
		return new NaNType();
	}

	static get Infinity() {
		return new InfinityType();
	}

	static get Numeric() {
		return new NumericType();
	}

	static get Integer() {
		return new IntegerType();
	}

	static get String() {
		return new StringType();
	}

	static Tuple(...types) {
		return new TupleType(...types);
	}

	static Array(type) {
		return new ArrayType(type);
	}

	static Interface(schema) {
		return new InterfaceType(schema);
	}

	static Object(type) {
		return new ObjectType(type);
	}

	static Union(...types) {
		return new UnionType(...types);
	}

	static Intersect(...types) {
		return new IntersectType(...types);
	}

	static Instance(constructorFunction, name) {
		return new InstanceType(constructorFunction, name);
	}
}

module.exports = { Type };