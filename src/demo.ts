import { Rule, RuleVariant, Parser } from './index';
import * as Meta from '../lib/Meta';
import * as Node from '../lib/Node';
import * as Problem from '../lib/Problem';
import * as Result from '../lib/Result';

{
	const ruleResult = Rule.begin('Hello', 'firstWord')
		.directlyFollowedBy(/^\s+/, null, true)
		.directlyFollowedBy('World', 'secondWord')
		.execute('Hello\r\nWorld TEst', null);

	console.group('Testing a single Rule')
	console.log('Result:\n', JSON.stringify(ruleResult, null, 2));
	console.groupEnd();
}
{
	const variantResult = RuleVariant.create([
		// English
		Rule.begin('Hello', 'firstWord')
			.followedBy('World', 'secondWord'),
		// German
		Rule.begin('Hallo', 'firstWord')
			.followedBy('Welt', 'secondWord')
	]).execute('Hello World', null);

	console.group('Testing a RuleVariant')
	console.log('Result:\n', JSON.stringify(variantResult, null, 2));
	console.groupEnd();
}
{
	const parserResult = Parser.create(
		RuleVariant.create([
			// English
			Rule.begin('Hello', 'firstWord')
				.followedBy('World', 'secondWord'),
			// German
			Rule.begin('Hallo', 'firstWord')
				.followedBy('Welt', 'secondWord')
		])
	).parse('Hallo Welt', true);

	console.group('Testing a Parser')
	console.log('Result:\n', JSON.stringify(parserResult, null, 2));
	console.groupEnd();
}

{
	const parserResult = Parser.create(
		RuleVariant.create([
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
		])
	).parse('Hallo\r\n\nWelt');

	console.group('Testing a Parser with transform')
	console.log('Result:\n', JSON.stringify(parserResult, null, 2));
	console.groupEnd();
}

{
	const parserResult = Parser.create(
		RuleVariant.create([
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
		])
	).parse('Hallo World');

	console.group('Testing a Parser with transform and throws')
	console.log('Result:\n', JSON.stringify(parserResult, null, 2));
	console.groupEnd();
}