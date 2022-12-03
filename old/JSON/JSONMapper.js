const Util = require('../Util/Util.class');

const JSONMapper = {
	JSON: function(codeString) {
		return JSONMapper.Container(codeString) || JSONMapper.Primitive(codeString);
	},
	Identifier: function(codeString) {
		const match = codeString.match(/^[a-zA-Z]+/u);

		if(!match)
			return null;

		return {
			type: 'Identifier',
			value: match[0],
			rest: codeString.slice(match[0].length)
		};
	},
	Primitive: {
		Primitive: function(codeString) {
			return JSONMapper.Primitive.Null(codeString) || 
					JSONMapper.Primitive.Boolean(codeString) || 
					JSONMapper.Primitive.Number(codeString) || 
					JSONMapper.Primitive.String(codeString) ||
					JSONMapper.Identifier(codeString);
		},
		Null: function(codeString) {
			const nullMatch = codeString.match(/^null/u);

			if(!nullMatch)
				return null;

			return {
				type: 'JSON.Primitive.Null',
				value: null,
				rest: codeString.slice(nullMatch[0].length)
			};
		},
		Boolean: function(codeString) {
			const booleanMatch = codeString.match(/^(true|false)/u);

			if(!booleanMatch)
				return null;

			return {
				type: 'JSON.Primitive.Boolean',
				value: booleanMatch[0],
				rest: codeString.slice(booleanMatch[0].length)
			};
		},
		Number: function(codeString) {
			const numberMatch = codeString.match(/^[0-9]+(\.[0-9]+)?/u);

			if(!numberMatch)
				return null;

			return {
				type: 'JSON.Primitive.Number',
				value: numberMatch[0],
				rest: codeString.slice(numberMatch[0].length)
			};
		},
		String: function(codeString) {
			const stringMatch = codeString.match(/^"([^"]|(?<=\\)")*"/u);

			if(!stringMatch)
				return null;

			return {
				type: 'JSON.Primitive.String',
				value: stringMatch[0],
				rest: codeString.slice(stringMatch[0].length)
			};
		}
	},
	Container: {
		// Container 		=> Array | Object .
		Container: function(codeString) {
			return JSONMapper.Container.Object(codeString) || JSONMapper.Container.Array(codeString);
		},
		// Array 			=> '[' > ArrayBody > ']' .
		Array: function(codeString) {
			let rest = codeString;

			const openParanthesisMatch = rest.match(/^\[/u);

			if(!openParanthesisMatch)
				return null;

			rest = Util.trimFront(rest.slice(openParanthesisMatch[0].length));

			const arrayBodyResult = JSONMapper.Container.ArrayBody(rest);

			if(arrayBodyResult)
				rest = arrayBody.rest;

			rest = Util.trimFront(rest);

			const closeParanthesisMatch = rest.match(/^\]/u);

			if(!closeParanthesisMatch)
				return null;

			return {
				type: 'JSON.Container.Array',
				value: arrayBodyResult ? arrayBodyResult.value : [],
				rest: rest.slice(closeParanthesisMatch[0].length)
			};
		},
		// ArrayBody		=> JSON > ',' > ArrayBody | JSON .
		ArrayBody: function(codeString) {
			let rest = codeString;

			const itemResult = JSONMapper.JSON(rest) || JSONMapper.Identifier(rest);

			if(!itemResult)
				return null;

			rest = Util.trimFront(itemResult.rest);

			const commaResult = rest.match(/^,/u);

			if(!commaResult)
				return {
					type: 'JSON.Container.ArrayBody',
					value: [itemResult],
					rest: rest
				};

			rest = Util.trimFront(rest.slice(commaResult[0].length));

			const arrayBodyResult = Grammar.JSON.Container.ArrayBody(rest);

			if(!arrayBodyResult)
				return null;

			return {
				type: 'JSON.Container.ArrayBody',
				value: [itemResult, ...arrayBodyResult.value],
				rest: arrayBodyResult.rest
			};
		},
		// Object 			=> '{' > ObjectBody > '}' .
		Object: function(codeString) {
			let rest = codeString;

			const openCurlyBracketMatch = rest.match(/^\{/u);

			if(!openCurlyBracketMatch)
				return null;

			rest = Util.trimFront(rest.slice(openCurlyBracketMatch[0].length));

			const objectBodyResult = JSONMapper.Container.ObjectBody(rest);

			if(objectBodyResult)
				rest = objectBodyResult.rest;

			rest = Util.trimFront(rest);

			const closeCurlyBracketMatch = rest.match(/^\}/u);

			if(!closeCurlyBracketMatch)
				return null;

			return {
				type: 'JSON.Container.Object',
				value: objectBodyResult ? objectBodyResult.value : [],
				rest: rest.slice(closeCurlyBracketMatch[0].length)
			};
		},
		//ObjectBody		=> KeyValuePair > ',' > ObjectBody | KeyValuePair .
		ObjectBody: function(codeString) {
			let rest = codeString;

			const keyValuePairResult = JSONMapper.Container.KeyValuePair(rest);

			if(!keyValuePairResult)
				return null;

			rest = Util.trimFront(keyValuePairResult.rest);

			const commaResult = rest.match(/^,/u);

			if(!commaResult)
				return {
					type: 'JSON.Container.ObjectBody',
					value: [{key: keyValuePairResult.key, value: keyValuePairResult.value}],
					rest: keyValuePairResult.rest
				};

			rest = Util.trimFront(rest.slice(commaResult[0].length));

			const objectBodyResult = JSONMapper.Container.ObjectBody(rest);

			if(!objectBodyResult)
				return null;

			return {
				type: 'JSON.Container.ObjectBody',
				value: [{key: keyValuePairResult.key, value: keyValuePairResult.value}, ...objectBodyResult.value],
				rest: objectBodyResult.rest
			};
		},
		// KeyValuePair		=> ((String | Identifier) > ':' > JSON) | Identifier .
		KeyValuePair: function(codeString) {
			let rest = codeString;

			const keyResult = JSONMapper.Primitive.String(rest) || JSONMapper.Identifier(rest);

			if(!keyResult)
				return null;
				
			rest = Util.trimFront(keyResult.rest);

			const colonMatch = rest.match(/^:/u);

			if(!colonMatch) {
				if(keyResult.type === 'JSON.Identifier')
					return {
						type: 'JSON.Container.KeyValuePair',
						key: keyResult,
						value: keyResult,
						rest: keyResult.rest
					};

				return null;
			}

			rest = Util.trimFront(rest.slice(colonMatch[0].length));

			const valueResult = JSONMapper.JSON(rest);

			if(!valueResult)
				return null;

			return {
				type: 'JSON.Container.KeyValuePair',
				key: keyResult,
				value: valueResult,
				rest: valueResult.rest
			};
		}
	}
}

module.exports = JSONMapper;