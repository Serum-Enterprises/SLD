import { Component, ComponentInterface } from "../src/Component";

describe("Testing Component", () => {
	test('Testing static fromJSON', () => {
		const component: ComponentInterface = {
			type: 'STRING',
			value: 'testValue',
			name: 'testName',
			greedy: true,
			optional: false
		};

		expect(Component.fromJSON(component)).toBeInstanceOf(Component);
	});

	test('Testing constructor', () => {
		expect(new Component('STRING', 'testValue', 'testName', true, false)).toBeInstanceOf(Component);
	});

	test('Testing get type', () => {
		expect(new Component('STRING', 'testValue', 'testName', true, false).type).toBe('STRING');
	});

	test('Testing get value', () => {
		expect(new Component('STRING', 'testValue', 'testName', true, false).value).toBe('testValue');
	});

	test('Testing get name', () => {
		expect(new Component('STRING', 'testValue', 'testName', true, false).name).toBe('testName');
	});

	test('Testing get greedy', () => {
		expect(new Component('STRING', 'testValue', 'testName', true, false).greedy).toBe(true);
	});

	test('Testing get optional', () => {
		expect(new Component('STRING', 'testValue', 'testName', true, false).optional).toBe(false);
	});

	test('Testing get matchFunction', () => {
		expect(new Component('STRING', 'testValue', 'testName', true, false).matchFunction).toBeInstanceOf(Function);
	});

	test('Testing toJSON', () => {
		expect(new Component('STRING', 'testValue', 'testName', true, false).toJSON()).toEqual({
			type: 'STRING',
			value: 'testValue',
			name: 'testName',
			greedy: true,
			optional: false
		});
	});
});