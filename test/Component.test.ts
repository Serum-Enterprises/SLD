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