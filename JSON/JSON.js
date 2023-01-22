const Range = require('../Util/Rule/Range.class');
const Location = require('../Util/Rule/Location.class');
const Node = require('../Util/Rule/Node.class');
const Result = require('../Util/Rule/Result.class');
const Debug = require('../Util/Debug.class');

const ASCII = require('../ASCII/ASCII');
const { Util } = require('../Util/Rule/Util.class');
const debug = new Debug('JSONParser');

const JSON_Parser = {
	Whitespace: (precedingNode, codeString) => {
		const localDebug = debug.extend('JSON.Whitespace');
		const match = codeString.match(/^[\x20|\x09|\x0A|\x0D]+/);

		if (!match) {
			return null;
		}
		return new Result(
			Node.createNode(precedingNode, 'JSON.Whitespace', match[0], match[0]),
			codeString.slice(match[0].length)
		);
	},
	JSON: (precedingNode, codeString) => {
		const result = JSON_Parser.Primitive.Primitive(precedingNode, codeString) || JSON_Parser.Container.Container(precedingNode, codeString);

		if (!result) {
			return null;
		}
		return new Result(
			new Node(
				'JSON',
				result.node.data,
				result.node.range,
				result.node.location
			),
			result.rest
		);
	},
	Primitive: {
		Primitive: (precedingNode, codeString) => {
			return JSON_Parser.Primitive.Null(precedingNode, codeString) ||
				JSON_Parser.Primitive.Boolean(precedingNode, codeString) ||
				JSON_Parser.Primitive.Number(precedingNode, codeString) ||
				JSON_Parser.Primitive.String(precedingNode, codeString);
		},
		String: (precedingNode, codeString) => {
			const match = codeString.match(/^\x22(([\x20-\x21]|[\x23-\x5B]|[\x5D-\uFFFF])|\x5C(\x22|\x5C|\x2F|\x62|\x66|\x6E|\x72|\x74|\x75[\x30-\x39\x61-\x66\x41-\x46]{4}))*\x22/u);

			if (!match)
				return null;

			return new Result(
				Node.createNode(precedingNode, 'JSON.String', match[0], match[0]),
				codeString.slice(match[0].length)
			);
		},
		Number: (precedingNode, codeString) => {
			const match = codeString.match(/^\x2D?[\x31-\x39][\x30-\x39]*(\x2E[\x30-\x39]+)?((\x65|\x45)(\x2D|\x2B)?[\x30-\x39]+)?/u);

			if (!match)
				return null;

			return new Result(
				Node.createNode(precedingNode, 'JSON.Number', Number(match[0]), match[0].length),
				codeString.slice(match[0].length)
			);
		},
		Boolean: (precedingNode, codeString) => {
			const match = codeString.match(/^(\x74\x72\x75\x65)|(\x66\x61\x6C\x73\x65)/u);

			if (!match)
				return null;

			return new Result(
				Node.createNode(precedingNode, 'JSON.Boolean', match[0] === 'true', match[0]),
				codeString.slice(match[0].length)
			);
		},
		Null: (precedingNode, codeString) => {
			const match = codeString.match(/^\x6E\x75\x6C\x6C/u);

			if (!match)
				return null;

			return new Result(
				Node.createNode(precedingNode, 'JSON.Null', null, match[0]),
				codeString.slice(match[0].length)
			);
		}
	},
	Container: {
		Container: (precedingNode, codeString) => {
			return JSON_Parser.Container.Object(precedingNode, codeString) || JSON_Parser.Container.Array(precedingNode, codeString);
		},
		Array: (precedingNode, codeString) => {
			const leftSquareBracketResult = ASCII.Structural.LeftSquareBracket(precedingNode, codeString);

			if (!leftSquareBracketResult)
				return null;

			const spaceResult1 = JSON_Parser.Whitespace(leftSquareBracketResult.node, leftSquareBracketResult.rest);

			const arrayBodyResult = spaceResult1 ?
				JSON_Parser.Container.ArrayBody(spaceResult1.node, spaceResult1.rest) :
				JSON_Parser.Container.ArrayBody(leftSquareBracketResult.node, leftSquareBracketResult.rest);

			const spaceResult2 = arrayBodyResult ?
				JSON_Parser.Whitespace(arrayBodyResult.node, arrayBodyResult.rest) :
				spaceResult1 ?
					JSON_Parser.Whitespace(spaceResult1.node, spaceResult1.rest) :
					JSON_Parser.Whitespace(leftSquareBracketResult.node, leftSquareBracketResult.rest);

			const rightSquareBracketResult = spaceResult2 ?
				ASCII.Structural.RightSquareBracket(spaceResult2.node, spaceResult2.rest) :
				arrayBodyResult ?
					ASCII.Structural.RightSquareBracket(arrayBodyResult.node, arrayBodyResult.rest) :
					spaceResult1 ?
						ASCII.Structural.RightSquareBracket(spaceResult1.node, spaceResult1.rest) :
						ASCII.Structural.RightSquareBracket(leftSquareBracketResult.node, leftSquareBracketResult.rest);

			if (!rightSquareBracketResult)
				return null;

			return new Result(
				new Node(
					'JSON.Array',
					arrayBodyResult ? [...arrayBodyResult.node.data] : [],
					new Range(leftSquareBracketResult.node.range.start, rightSquareBracketResult.node.range.end),
					new Location(leftSquareBracketResult.node.location.start, rightSquareBracketResult.node.location.end)
				),
				rightSquareBracketResult.rest
			);
		},
		Object: (precedingNode, codeString) => {
			const leftCurlyBracketResult = ASCII.Structural.LeftCurlyBracket(precedingNode, codeString);

			if (!leftCurlyBracketResult)
				return null;

			const spaceResult1 = JSON_Parser.Whitespace(leftCurlyBracketResult.node, leftCurlyBracketResult.rest);

			const objectBodyResult = spaceResult1 ?
				JSON_Parser.Container.ObjectBody(spaceResult1.node, spaceResult1.rest) :
				JSON_Parser.Container.ObjectBody(leftCurlyBracketResult.node, leftCurlyBracketResult.rest);

			const spaceResult2 = objectBodyResult ?
				JSON_Parser.Whitespace(objectBodyResult.node, objectBodyResult.rest) :
				spaceResult1 ?
					JSON_Parser.Whitespace(spaceResult1.node, spaceResult1.rest) :
					JSON_Parser.Whitespace(leftCurlyBracketResult.node, leftCurlyBracketResult.rest);

			const closeResult = spaceResult2 ?
				ASCII.Structural.RightCurlyBracket(spaceResult2.node, spaceResult2.rest) :
				objectBodyResult ?
					ASCII.Structural.RightCurlyBracket(objectBodyResult.node, objectBodyResult.rest) :
					spaceResult1 ?
						ASCII.Structural.RightCurlyBracket(spaceResult1.node, spaceResult1.rest) :
						ASCII.Structural.RightCurlyBracket(openResult.node, openResult.rest);

			if (!closeResult)
				return null;

			return new Result(
				new Node(
					'JSON.Object',
					objectBodyResult ? [...objectBodyResult.node.data] : [],
					new Range(openResult.node.range.start, closeResult.node.range.end),
					new Location(openResult.node.location.start, closeResult.node.location.end)
				),
				closeResult.rest
			);
		},
		ArrayBody: (precedingNode, codeString) => {
			const valueResult = JSON_Parser.JSON(precedingNode, codeString);

			if (!valueResult)
				return null;

			const spaceResult1 = JSON_Parser.Whitespace(valueResult.node, valueResult.rest);

			const commaMatch = spaceResult1 ?
				ASCII.Structural.Comma(spaceResult1.node, spaceResult1.rest) :
				ASCII.Structural.Comma(valueResult.node, valueResult.rest);

			if (!commaMatch)
				return new Result(
					Node.createNode(precedingNode, 'JSON.ArrayBody', [valueResult.node.toJSON()], valueResult.rest),
					valueResult.rest
				);

			const spaceResult2 = JSON_Parser.Whitespace(commaMatch.node, commaMatch.rest);

			const arrayBodyResult = spaceResult2 ?
				JSON_Parser.Container.ArrayBody(spaceResult2.node, spaceResult2.rest) :
				JSON_Parser.Container.ArrayBody(commaMatch.node, commaMatch.rest);

			if (!arrayBodyResult)
				return null;
				
			return new Result(
				new Node(
					'JSON.ArrayBody',
					[valueResult.node.toJSON(), ...arrayBodyResult.node.data],
					new Range(valueResult.node.range.start, arrayBodyResult.node.data[arrayBodyResult.node.data.length - 1].range.end),
					new Location(valueResult.node.location.start, arrayBodyResult.node.data[arrayBodyResult.node.data.length - 1].location.end)
				),
				arrayBodyResult.rest
			);
		},
		ObjectBody: (precedingNode, codeString) => {
			const pairResult = JSON_Parser.Container.Pair(precedingNode, codeString);

			if (!pairResult)
				return null;

			const spaceResult1 = JSON_Parser.Whitespace(pairResult.node, pairResult.rest);

			const commaResult = spaceResult1 ?
				ASCII.Structural.Comma(spaceResult1.node, spaceResult1.rest) :
				ASCII.Structural.Comma(pairResult.node, pairResult.rest);

			if (!commaResult)
				return new Result(
					new Node(
						'JSON.Container.ObjectBody',
						[pairResult.node.toJSON()],
						pairResult.node.range,
						pairResult.node.location
					),
					pairResult.rest
				);

			const spaceResult2 = JSON_Parser.Whitespace(commaResult.node, commaResult.rest);

			const objectBodyResult = spaceResult2 ?
				JSON_Parser.Container.ObjectBody(spaceResult2.node, spaceResult2.rest) :
				JSON_Parser.Container.ObjectBody(commaResult.node, commaResult.rest);

			if (!objectBodyResult)
				return null;
			return new Result(
				new Node(
					'JSON.Container.ObjectBody',
					[pairResult.node.toJSON(), ...objectBodyResult.node.data],
					new Range(pairResult.node.range.start, objectBodyResult.node.data[objectBodyResult.node.data.length - 1].range.end),
					new Location(pairResult.node.location.start, objectBodyResult.node.data[objectBodyResult.node.data.length - 1].location.end)
				),
				objectBodyResult.rest
			);
		},
		Pair: (precedingNode, codeString) => {
			const keyResult = JSON_Parser.Primitive.String(precedingNode, codeString);

			if (!keyResult)
				return null;

			const spaceResult1 = JSON_Parser.Whitespace(keyResult.node, keyResult.rest);

			const colonResult = spaceResult1 ?
				ASCII.Structural.Colon(spaceResult1.node, spaceResult1.rest) :
				ASCII.Structural.Colon(keyResult.node, keyResult.rest);

			if (!colonResult)
				return null;

			const spaceResult2 = JSON_Parser.Whitespace(colonResult.node, colonResult.rest);

			const valueResult = spaceResult2 ?
				JSON_Parser.JSON(spaceResult2.node, spaceResult2.rest) :
				JSON_Parser.JSON(colonResult.node, colonResult.rest);

			if (!valueResult)
				return null;

			return new Result(
				new Node(
					'JSON.Container.Pair',
					{
						key: keyResult.node.toJSON(),
						value: valueResult.node.toJSON()
					},
					new Range(keyResult.node.range.start, valueResult.node.range.end),
					new Location(keyResult.node.location.start, valueResult.node.location.end)
				),
				valueResult.rest
			);
		}
	}
};

module.exports = JSON_Parser;