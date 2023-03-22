import { Rule, RuleVariant, Parser, Matcher } from './index';
import * as Meta from '../lib/Meta';
import * as Node from '../lib/Node';
import * as Problem from '../lib/Problem';
import * as Result from '../lib/Result';

const OPTIONS: { META: boolean } = {
	META: false
};

const multiLangRuleVariant: RuleVariant = RuleVariant.create([
	// English
	Rule.begin('Hello', 'firstWord')
		.followedBy('World', 'secondWord'),
	// German
	Rule.begin('Hallo', 'firstWord')
		.followedBy('Welt', 'secondWord')
]);

const multiLangRuleVariantWithTransform: RuleVariant = RuleVariant.create([
	// English
	Rule.begin('Hello', 'firstWord')
		.followedBy('World', 'secondWord')
		.transform((nodes: { [key: string]: Node.Node }, raw: string, meta: Meta.Meta) => {
			return Object.values(nodes).reduce((result, node) => {
				return result + node.raw;
			}, '');
		}),
	// German
	Rule.begin('Hallo', 'firstWord')
		.followedBy('Welt', 'secondWord')
		.transform((nodes: { [key: string]: Node.Node }, raw: string, meta: Meta.Meta) => {
			return Object.values(nodes).reduce((result, node) => {
				return result + node.raw;
			}, '');
		}),
]);

const mixupRuleVariantWithThrow: RuleVariant = RuleVariant.create([
	// English
	Rule.begin('Hello', 'firstWord')
		.followedBy('World', 'secondWord')
		.transform((nodes: { [key: string]: Node.Node }, raw: string, meta: Meta.Meta) => {
			return Object.values(nodes).reduce((result, node) => {
				return result + node.raw;
			}, '');
		}),
	// German
	Rule.begin('Hallo', 'firstWord')
		.followedBy('Welt', 'secondWord')
		.transform((nodes: { [key: string]: Node.Node }, raw: string, meta: Meta.Meta) => {
			return Object.values(nodes).reduce((result, node) => {
				return result + node.raw;
			}, '');
		}),
	// Mixups
	Rule.begin('Hello', 'firstWord')
		.followedBy('Welt', 'secondWord')
		.throw('Mixup of languages'),
	Rule.begin('Hallo', 'firstWord')
		.followedBy('World', 'secondWord')
		.throw('Mixup of languages'),
]);

const expression: RuleVariant = RuleVariant.create([
	Rule.begin(/\d+/, 'value')
		.followedBy('+')
		.followedBy(Matcher.matchRuleVariant('expression'), 'expression')
		.transform((nodes: { [key: string]: Node.Node }, raw: string, meta: Meta.Meta) => {
			if (!(typeof nodes.value.data === 'string' && typeof nodes.expression.data === 'object'))
				throw new TypeError('Internal Parsing Error');

			return parseInt(nodes.value.data) + (nodes.expression.data as { data: number }).data;
		}),
	Rule.begin(/\d+/, 'value')
		.followedBy('+')
		.throw('Expected an Expression after "+"'),
	Rule.begin(/\d+/, 'value')
		.transform((nodes: { [key: string]: Node.Node }, raw: string, meta: Meta.Meta) => {
			if (typeof nodes.value.data !== 'string')
				throw new TypeError('Internal Parsing Error');

			return parseInt(nodes.value.data);
		})
]);

const example1: Result.Result = Parser.create(multiLangRuleVariant).parse('Hello World', OPTIONS.META);
const example2: Result.Result = Parser.create(multiLangRuleVariant).parse('Hallo Welt', OPTIONS.META);
const example3: Result.Result = Parser.create(multiLangRuleVariant).parse('Hallo\r\n\nWelt', OPTIONS.META);
const example4: Result.Result = Parser.create(multiLangRuleVariantWithTransform).parse('Hello\r\n\nWorld', OPTIONS.META);
const example5: Result.Result = Parser.create(mixupRuleVariantWithThrow).parse('Hello\r\n\nWelt', OPTIONS.META);
const example6: Result.Result = Parser.create(expression, [['expression', expression]]).parse('1+2+3+4+5+6+7+8+9+10', OPTIONS.META);

console.group('Example 1: Hello World')
console.log('Result:\n', JSON.stringify(example1, null, 2));
console.groupEnd();

console.group('Example 2: Hallo Welt')
console.log('Result:\n', JSON.stringify(example2, null, 2));
console.groupEnd();

console.group('Example 3: Hallo\\r\\n\\nWelt')
console.log('Result:\n', JSON.stringify(example3, null, 2));
console.groupEnd();

console.group('Example 4: Hello\\r\\n\\nWorld')
console.log('Result:\n', JSON.stringify(example4, null, 2));
console.groupEnd();

console.group('Example 5: Hello\\r\\n\\nWelt')
console.log('Result:\n', JSON.stringify(example5, null, 2));
console.groupEnd();

console.group('Example 6: 1+2+3+4+5+6+7+8+9+10')
console.log('Result:\n', JSON.stringify(example6, null, 2));
console.groupEnd();