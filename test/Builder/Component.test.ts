import { Component } from '../../Builder/Component';

describe("Testing Component", () => {
	test('Testing static create', () => {
		expect(Component.create('STRING', 'testValue', 'testName', true, false)).toBeInstanceOf(Component);
	});

	test('Testing constructor', () => {
		expect(new Component('STRING', 'testValue', 'testName', true, false)).toBeInstanceOf(Component);
	})

	test('Testing get type', () => {
		expect(Component.create('STRING', 'testValue', 'testName', true, false).type).toBe('STRING');
	});

	test('Testing get value', () => {
		expect(Component.create('STRING', 'testValue', 'testName', true, false).value).toBe('testValue');
	});

	test('Testing get name', () => {
		expect(Component.create('STRING', 'testValue', 'testName', true, false).name).toBe('testName');
	});

	test('Testing get greedy', () => {
		expect(Component.create('STRING', 'testValue', 'testName', true, false).greedy).toBe(true);
	});

	test('Testing get optional', () => {
		expect(Component.create('STRING', 'testValue', 'testName', true, false).optional).toBe(false);
	});

	test('Testing toJSON', () => {
		expect(Component.create('STRING', 'testValue', 'testName', true, false).toJSON()).toEqual({
			type: 'STRING',
			value: 'testValue',
			name: 'testName',
			greedy: true,
			optional: false
		});
	});
});