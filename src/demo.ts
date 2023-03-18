import Rule from './index';

const result = Rule.begin('Hello', 'firstWord')
	.directlyFollowedBy(/^\s+/, null, true)
	.directlyFollowedBy('World', 'secondWord')
	.execute('Hello\r\nWorld TEst', null);

console.log(JSON.stringify(result, null, 2));