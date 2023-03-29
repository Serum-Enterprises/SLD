import * as Problem from '../../src/lib/Problem';

describe('Testing Problem', () => {
	test('Testing Problem.create', () => {
		expect(Problem.create(Problem.TYPE.ERROR, 'Error message'))
			.toEqual({
				type: Problem.TYPE.ERROR,
				message: 'Error message'
			});

		expect(Problem.create(Problem.TYPE.MISMATCH, 'Error message'))
			.toEqual({
				type: Problem.TYPE.MISMATCH,
				message: 'Error message'
			});
	});
});