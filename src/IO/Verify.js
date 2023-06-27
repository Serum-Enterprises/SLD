class Verify {
	static component(data, varName = 'data') {
		if (Object.prototype.toString.call(data) !== '[object Object]')
			throw new TypeError(`Expected ${varName} to be an Object`);

		if (typeof data.type !== 'string')
			throw new TypeError(`Expected ${varName}.type to be a String`);

		if (!['STRING', 'REGEXP', 'VARIANT'].includes(data.type.toUpperCase()))
			throw new RangeError(`Expected ${varName}.type to be "STRING", "REGEXP" or "VARIANT"`);

		if (typeof data.value !== 'string')
			throw new TypeError(`Expected ${varName}.value to be a String`);

		if (data.name !== null && typeof data.name !== 'string')
			throw new TypeError(`Expected ${varName}.name to be a String or null`);

		if (typeof data.optional !== 'boolean')
			throw new TypeError(`Expected ${varName}.optional to be a Boolean`);

		if (typeof data.greedy !== 'boolean')
			throw new TypeError(`Expected ${varName}.greedy to be a Boolean`);

		return data;
	}

	static rule(data, varName = 'data') {
		if (Object.prototype.toString.call(data) !== '[object Object]')
			throw new TypeError(`Expected ${varName} to be an Object`);

		if (!Array.isArray(data.components))
			throw new TypeError(`Expected ${varName}.components to be an Array`);

		data.components.forEach((component, index) => Verify.component(component, `${varName}.components[${index}]`));

		if (data.autoThrow !== null && typeof data.autoThrow !== 'string')
			throw new TypeError(`Expected ${varName}.autoThrow to be a String or null`);

		if (data.autoRecover !== null)
			Verify.component(data.autoRecover, `${varName}.autoRecover`);

		return data;
	}

	static variant(data, varName = 'data') {
		if (Object.prototype.toString.call(data) !== '[object Object]')
			throw new TypeError(`Expected ${varName} to be an Object`);

		if (!Array.isArray(data.rules))
			throw new TypeError(`Expected ${varName}.rules to be an Array`);

		data.rules.forEach((rule, index) => Verify.rule(rule, `${varName}.rule[${index}]`));

		return data;
	}

	static parser(data, varName = 'data') {
		if (Object.prototype.toString.call(data) !== '[object Object]')
			throw new TypeError(`Expected ${varName} to be an Object`);

		Verify.variant(data.rootVariant, `${varName}.rootVariant`);

		if (Object.prototype.toString.call(data.variants) !== '[object Object]')
			throw new TypeError(`Expected ${varName}.variants to be an Object`);

		Object.entries(data.variants).forEach(([key, value]) => Verify.variant(value, `${varName}.variants[${key}]`));

		return data;
	}
}

module.exports = Verify;