import { Rule, RuleVariant } from './index';

const ruleResult = Rule.begin('Hello', 'firstWord')
	.directlyFollowedBy(/^\s+/, null, true)
	.directlyFollowedBy('World', 'secondWord')
	.execute('Hello\r\nWorld TEst', null);

const variantResult =  RuleVariant.create([
	// English
	Rule.begin('Hello', 'firstWord')
		.followedBy('World', 'secondWord'),
	// German
	Rule.begin('Hallo', 'firstWord')
		.followedBy('Welt', 'secondWord')
]).execute('Hello World', null);

console.group('Testing a single Rule')
console.log('Result:\n', JSON.stringify(ruleResult, null, 2));
console.groupEnd();

console.group('Testing a RuleVariant')
console.log('Result:\n', JSON.stringify(variantResult, null, 2));
console.groupEnd();