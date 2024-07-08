const { AnyType } = require('./Any');

class NullishType extends AnyType {
	validate(value, varName = 'value') {
		if (typeof varName !== 'string')
			throw new TypeError('Expected varName to be a String');

		if (value !== null && value !== undefined)
			throw new TypeError(`Expected ${varName} to be Nullish`);

		super.validate(value, varName);
	}
}

class UndefinedType extends NullishType {
	validate(value, varName = 'value') {
		if (typeof varName !== 'string')
			throw new TypeError('Expected varName to be a String');

		if (value !== undefined)
			throw new TypeError(`Expected ${varName} to be Undefined`);

		super.validate(value, varName);
	}
}
class NullType extends NullishType {
	validate(value, varName = 'value') {
		if (typeof varName !== 'string')
			throw new TypeError('Expected varName to be a String');

		if (value !== null)
			throw new TypeError(`Expected ${varName} to be Null`);
		
		super.validate(value, varName);
	}
}

class BooleanType extends AnyType {
	validate(value, varName = 'value') {
		if (typeof varName !== 'string')
			throw new TypeError('Expected varName to be a String');

		if (typeof value !== 'boolean')
			throw new TypeError(`Expected ${varName} to be a Boolean`);

		super.validate(value, varName);
	}
}

class NumberType extends AnyType {
	validate(value, varName = 'value') {
		if (typeof varName !== 'string')
			throw new TypeError('Expected varName to be a String');

		if (typeof value !== 'number')
			throw new TypeError(`Expected ${varName} to be a Number`);

		super.validate(value, varName);
	}
}

class InfinityType extends NumberType {
	validate(value, varName = 'value') {
		if (typeof varName !== 'string')
			throw new TypeError('Expected varName to be a String');

		if (value !== Infinity && value !== -Infinity)
			throw new TypeError(`Expected ${varName} to be Infinity`);

		super.validate(value, varName);
	}
}

class NaNType extends NumberType {
	validate(value, varName = 'value') {
		if (typeof varName !== 'string')
			throw new TypeError('Expected varName to be a String');

		if (!Number.isNaN(value))
			throw new TypeError(`Expected ${varName} to be NaN`);

		super.validate(value, varName);
	}
}

class NumericType extends NumberType {
	validate(value, varName = 'value') {
		if (typeof varName !== 'string')
			throw new TypeError('Expected varName to be a String');

		if (!Number.isFinite(value))
			throw new TypeError(`Expected ${varName} to be Numeric`);

		super.validate(value, varName);
	}
}

class IntegerType extends NumericType {
	validate(value, varName = 'value') {
		if (typeof varName !== 'string')
			throw new TypeError('Expected varName to be a String');

		if (!Number.isSafeInteger(value))
			throw new TypeError(`Expected ${varName} to be an Integer`);

		super.validate(value, varName);
	}
}

class StringType extends AnyType {
	validate(value, varName = 'value') {
		if (typeof varName !== 'string')
			throw new TypeError('Expected varName to be a String');

		if (typeof value !== 'string')
			throw new TypeError(`Expected ${varName} to be a String`);

		super.validate(value, varName);
	}
}

module.exports = {
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
}