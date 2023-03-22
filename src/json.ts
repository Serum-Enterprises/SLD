import { Rule, RuleVariant, Parser, Matcher } from './index';
import * as Meta from '../lib/Meta';
import * as Node from '../lib/Node';
import * as Problem from '../lib/Problem';
import * as Result from '../lib/Result';

const OPTIONS: { META: boolean } = {
	META: false
};

// Null
const nullPrimitive = RuleVariant.create([
	Rule.begin('null', 'value')
		.transform((nodes: { [key: string]: Node.Node }, raw: string, meta: Meta.Meta) => {
			return {
				type: 'NullPrimitive',
				data: null
			};
		})
]);
// Boolean
const booleanPrimitive = RuleVariant.create([
	Rule.begin('true', 'value')
		.transform((nodes: { [key: string]: Node.Node }, raw: string, meta: Meta.Meta) => {
			return {
				type: 'BooleanPrimitive',
				data: true
			};
		}),
	Rule.begin('false', 'value')
		.transform((nodes: { [key: string]: Node.Node }, raw: string, meta: Meta.Meta) => {
			return {
				type: 'BooleanPrimitive',
				data: false
			};
		})
]);
// Number
const numberPrimitive = RuleVariant.create([
	Rule.begin(/\d+/, 'value')
		.transform((nodes: { [key: string]: Node.Node }, raw: string, meta: Meta.Meta) => {
			return {
				type: 'NumberPrimitive',
				data: Number.parseInt(nodes.value.data as string)
			};
		})
]);
// String
const stringPrimitive = RuleVariant.create([
	Rule.begin('"')
		.followedBy(/[^"]+/, 'value')
		.followedBy('"')
		.transform((nodes: { [key: string]: Node.Node }, raw: string, meta: Meta.Meta) => {
			return {
				type: 'StringPrimitive',
				data: nodes.value.data as string
			};
		}),
	Rule.begin('"')
		.followedBy('"')
		.transform((nodes: { [key: string]: Node.Node }, raw: string, meta: Meta.Meta) => {
			return {
				type: 'StringPrimitive',
				data: ''
			};
		}),
	Rule.begin('"')
		.followedBy(/[^"]*/, 'value', true)
		.throw('Expected a closing "'),
	Rule.begin('"')
		.throw('Expected a value or closing "'),

]);

const arrayBody = RuleVariant.create([
	Rule.begin(Matcher.matchRuleVariant('json'), 'value')
		.followedBy(',')
		.followedBy(Matcher.matchRuleVariant('arrayBody'), 'arrayBody')
		.transform((nodes: { [key: string]: Node.Node }, raw: string, meta: Meta.Meta) => {
			console.log(JSON.stringify(JSON.parse(JSON.stringify(nodes), (key: string, value: any) => key === 'meta' ? undefined : value), null, 2));
			return {
				type: 'ArrayBody',
				data: [(nodes.value.data as {data: unknown}).data, ...(nodes.arrayBody.data as {data: {data: unknown[]}}).data.data]
			};
		}),
	Rule.begin(Matcher.matchRuleVariant('json'))
		.followedBy(',')
		.throw('Expected a value after ","'),
	Rule.begin(Matcher.matchRuleVariant('json'), 'value')
		.transform((nodes: { [key: string]: Node.Node }, raw: string, meta: Meta.Meta) => {
			return {
				type: 'ArrayBody',
				data: [(nodes.value.data as {data: unknown}).data]
			};
		}),
]);

const array = RuleVariant.create([
	Rule.begin('[')
		.followedBy(Matcher.matchRuleVariant('arrayBody'), 'body')
		.followedBy(']')
		.transform((nodes: { [key: string]: Node.Node }, raw: string, meta: Meta.Meta) => {
			return {
				type: 'Array',
				data: nodes.body.data as {data: unknown[]}[]
			};
		}),
	Rule.begin('[')
		.followedBy(']')
		.transform(() => ({ data: [] })),
	Rule.begin('[')
		.followedBy(Matcher.matchRuleVariant('arrayBody'))
		.throw('Expected a closing "]"'),
	Rule.begin('[')
		.throw('Expected a value or "]"'),
]);

const pair = RuleVariant.create([
	Rule.begin(Matcher.matchRuleVariant('stringPrimitive'), 'key')
		.followedBy(':')
		.followedBy(Matcher.matchRuleVariant('json'), 'value'),
	Rule.begin(Matcher.matchRuleVariant('stringPrimitive'), 'key')
		.followedBy(':')
		.throw('Expected a value after ":"'),
	Rule.begin(Matcher.matchRuleVariant('stringPrimitive'), 'key')
		.throw('Expected a ":" after the key'),
]);

const objectBody = RuleVariant.create([
	Rule.begin(Matcher.matchRuleVariant('pair'), 'pair')
		.followedBy(',')
		.followedBy(Matcher.matchRuleVariant('objectBody'), 'objectBody'),
	Rule.begin(Matcher.matchRuleVariant('pair'), 'pair'),
	Rule.begin(Matcher.matchRuleVariant('pair'))
		.followedBy(',')
		.throw('Expected a value after ","'),
]);



const object = RuleVariant.create([
	Rule.begin('{')
		.followedBy(Matcher.matchRuleVariant('objectBody'), 'body')
		.followedBy('}'),
	Rule.begin('{')
		.followedBy('}'),
	Rule.begin('{')
		.followedBy(Matcher.matchRuleVariant('objectBody'))
		.throw('Expected a closing "}"'),
	Rule.begin('{')
		.throw('Expected a value or "}"'),
]);

const json = RuleVariant.create([
	Rule.begin(Matcher.matchRuleVariant('object'), 'object'),
	Rule.begin(Matcher.matchRuleVariant('array'), 'array'),
	Rule.begin(Matcher.matchRuleVariant('stringPrimitive'), 'string'),
	Rule.begin(Matcher.matchRuleVariant('numberPrimitive'), 'number'),
	Rule.begin(Matcher.matchRuleVariant('booleanPrimitive'), 'boolean'),
	Rule.begin(Matcher.matchRuleVariant('nullPrimitive'), 'null'),
	Rule.throw('Expected Null, Boolean, Number, String, Array or Object')
]);

const jsonParser = Parser.create(json, [
	['json', json],
	['stringPrimitive', stringPrimitive],
	['numberPrimitive', numberPrimitive],
	['booleanPrimitive', booleanPrimitive],
	['nullPrimitive', nullPrimitive],
	['array', array],
	['arrayBody', arrayBody],
	['object', object],
	['objectBody', objectBody],
	['pair', pair]
]);

console.group('Example 1');
console.log(JSON.stringify(jsonParser.parse('{"a": 1, "b": 2, "c": 3}'), null, 2));
console.groupEnd();

console.group('Example 2');
console.log(JSON.stringify(jsonParser.parse('{"a": 1, "b": 2, "c": 3, "d": {"e": 4, "f": 5}}'), null, 2));
console.groupEnd();

console.group('Example 3');
console.log(JSON.stringify(jsonParser.parse('{"a": 1, "b": 2, "c": 3, "d": {"e": 4, "f": 5}, "g": [6, 7, 8]}'), null, 2));
console.groupEnd();

const a = function (x: string) {
	f(x.slice(1));
}

const f = function (x: string) {
	a(x.slice(1));
}