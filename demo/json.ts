import { Parser, RuleVariant, Rule, MatchEngine, Result, Problem, Node, Meta } from '../src/index';


const jsonRules = {
	Primitive: {
		
	},
	Container: {
		Array: RuleVariant.create([]),
		ArrayBody: RuleVariant.create([]),
		Object: RuleVariant.create([]),
		ObjectBody: RuleVariant.create([]),
		Pair: RuleVariant.create([]),
	}
}

// Null
const nullPrimitive = RuleVariant.create([
	Rule.begin('null', 'value')
		.transform((nodes: { [key: string]: Node }, raw: string, meta: Meta) => {
			return {
				type: 'NullPrimitive',
				data: null
			};
		})
]);
// Boolean
const booleanPrimitive = RuleVariant.create([
	Rule.begin('true', 'value')
		.transform((nodes: { [key: string]: Node }, raw: string, meta: Meta) => {
			return {
				type: 'BooleanPrimitive',
				data: true
			};
		}),
	Rule.begin('false', 'value')
		.transform((nodes: { [key: string]: Node }, raw: string, meta: Meta) => {
			return {
				type: 'BooleanPrimitive',
				data: false
			};
		})
]);
// Number
const numberPrimitive = RuleVariant.create([
	Rule.begin(/\d+/, 'value')
		.transform((nodes: { [key: string]: Node }, raw: string, meta: Meta) => {
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
		.transform((nodes: { [key: string]: Node }, raw: string, meta: Meta) => {
			return {
				type: 'StringPrimitive',
				data: nodes.value.data as string
			};
		}),
	Rule.begin('"')
		.followedBy('"')
		.transform((nodes: { [key: string]: Node }, raw: string, meta: Meta) => {
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
	Rule.begin(MatchEngine.matchRuleVariant('json'), 'value')
		.followedBy(',')
		.followedBy(MatchEngine.matchRuleVariant('arrayBody'), 'arrayBody')
		.transform((nodes: { [key: string]: Node }, raw: string, meta: Meta) => {
			console.log(JSON.stringify(JSON.parse(JSON.stringify(nodes), (key: string, value: any) => key === 'meta' ? undefined : value), null, 2));
			return {
				type: 'ArrayBody',
				data: [(nodes.value.data as { data: unknown }).data, ...(nodes.arrayBody.data as { data: { data: unknown[] } }).data.data]
			};
		}),
	Rule.begin(MatchEngine.matchRuleVariant('json'))
		.followedBy(',')
		.throw('Expected a value after ","'),
	Rule.begin(MatchEngine.matchRuleVariant('json'), 'value')
		.transform((nodes: { [key: string]: Node }, raw: string, meta: Meta) => {
			return {
				type: 'ArrayBody',
				data: [(nodes.value.data as { data: unknown }).data]
			};
		}),
]);

const array = RuleVariant.create([
	Rule.begin('[')
		.followedBy(MatchEngine.matchRuleVariant('arrayBody'), 'body')
		.followedBy(']')
		.transform((nodes: { [key: string]: Node }, raw: string, meta: Meta) => {
			return {
				type: 'Array',
				data: nodes.body.data as { data: unknown[] }[]
			};
		}),
	Rule.begin('[')
		.followedBy(']')
		.transform(() => ({ data: [] })),
	Rule.begin('[')
		.followedBy(MatchEngine.matchRuleVariant('arrayBody'))
		.throw('Expected a closing "]"'),
	Rule.begin('[')
		.throw('Expected a value or "]"'),
]);

const pair = RuleVariant.create([
	Rule.begin(MatchEngine.matchRuleVariant('stringPrimitive'), 'key')
		.followedBy(':')
		.followedBy(MatchEngine.matchRuleVariant('json'), 'value'),
	Rule.begin(MatchEngine.matchRuleVariant('stringPrimitive'), 'key')
		.followedBy(':')
		.throw('Expected a value after ":"'),
	Rule.begin(MatchEngine.matchRuleVariant('stringPrimitive'), 'key')
		.throw('Expected a ":" after the key'),
]);

const objectBody = RuleVariant.create([
	Rule.begin(MatchEngine.matchRuleVariant('pair'), 'pair')
		.followedBy(',')
		.followedBy(MatchEngine.matchRuleVariant('objectBody'), 'objectBody'),
	Rule.begin(MatchEngine.matchRuleVariant('pair'), 'pair'),
	Rule.begin(MatchEngine.matchRuleVariant('pair'))
		.followedBy(',')
		.throw('Expected a value after ","'),
]);



const object = RuleVariant.create([
	Rule.begin('{')
		.followedBy(MatchEngine.matchRuleVariant('objectBody'), 'body')
		.followedBy('}'),
	Rule.begin('{')
		.followedBy('}'),
	Rule.begin('{')
		.followedBy(MatchEngine.matchRuleVariant('objectBody'))
		.throw('Expected a closing "}"'),
	Rule.begin('{')
		.throw('Expected a value or "}"'),
]);

const json = RuleVariant.create([
	Rule.begin(MatchEngine.matchRuleVariant('object'), 'object'),
	Rule.begin(MatchEngine.matchRuleVariant('array'), 'array'),
	Rule.begin(MatchEngine.matchRuleVariant('stringPrimitive'), 'string'),
	Rule.begin(MatchEngine.matchRuleVariant('numberPrimitive'), 'number'),
	Rule.begin(MatchEngine.matchRuleVariant('booleanPrimitive'), 'boolean'),
	Rule.begin(MatchEngine.matchRuleVariant('nullPrimitive'), 'null'),
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