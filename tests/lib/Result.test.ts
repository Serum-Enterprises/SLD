import * as Result from '../../src/lib/Result';
import * as Node from '../../src/lib/Node';
import * as Problem from '../../src/lib/Problem';

describe('Testing Result', () => {
	test('Testing Result.createOK', () => {
		const result = Result.createOK(Node.TYPE.MATCH, null, null, 'Hello World', '');
		
		expect(result).toEqual({
			status: 'OK',
			node: Node.create(Node.TYPE.MATCH, null, null, 'Hello World'),
			rest: ''
		});
	});

	test('Testing Result.createERROR', () => {
		const result = Result.createERROR(Problem.TYPE.MISMATCH, 'Invalid character');
		
		expect(result).toEqual({
			status: 'ERROR',
			problem: Problem.create(Problem.TYPE.MISMATCH, 'Invalid character')
		});
	});

	test('calculateOK', () => {
		const precedingNode = Node.create(Node.TYPE.MATCH, null, null, 'Hello');
		const result = Result.calculateOK(precedingNode, Node.TYPE.MATCH, null, null, ' World', '');
		
		expect(result).toEqual({
			status: 'OK',
			node: Node.calculate(precedingNode, Node.TYPE.MATCH, null, null, ' World'),
			rest: ''
		});
	});

	test('calculateRaw', () => {
		const firstResult = Result.createOK(Node.TYPE.MATCH, null, null, 'Hello', ' World');
		const lastResult = Result.calculateOK(firstResult.node, Node.TYPE.MATCH, null, null, ' World', '');
		const result = Result.calculateRaw(firstResult, lastResult);
		
		expect(result).toBe('Hello World');
	});
});