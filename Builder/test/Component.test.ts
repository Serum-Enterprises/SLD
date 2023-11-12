import { Component, PrefixComponent, RecoverComponent } from '../src/Component';

describe('Testing Component', () => {
	describe('Testing RecoverComponent', () => {
		test('Testing static create', () => {
			expect(RecoverComponent.create('STRING', 'testValue')).toBeInstanceOf(RecoverComponent);
			expect(RecoverComponent.create('REGEXP', '[a-z]')).toBeInstanceOf(RecoverComponent);
		});

		test('Testing constructor', () => {
			expect(new RecoverComponent('STRING', 'testValue')).toBeInstanceOf(RecoverComponent);
			expect(new RecoverComponent('REGEXP', '[a-z]')).toBeInstanceOf(RecoverComponent);
		});

		test('Testing get type', () => {
			expect(RecoverComponent.create('STRING', 'testValue').type).toBe('STRING');
			expect(RecoverComponent.create('REGEXP', '[a-z]').type).toBe('REGEXP');
		});

		test('Testing get value', () => {
			expect(RecoverComponent.create('STRING', 'testValue').value).toBe('testValue');
			expect(RecoverComponent.create('REGEXP', '[a-z]').value).toBe('[a-z]');
		});

		test('Testing toJSON', () => {
			expect(RecoverComponent.create('STRING', 'testValue').toJSON()).toEqual({
				type: 'STRING',
				value: 'testValue',
			});
			expect(RecoverComponent.create('REGEXP', '[a-z]').toJSON()).toEqual({
				type: 'REGEXP',
				value: '[a-z]',
			});
		});
	});

	describe('Testing PrefixComponent', () => {
		test('Testing static create', () => {
			expect(Component.create('STRING', 'testValue', 'testName', true, false)).toBeInstanceOf(Component);
			expect(Component.create('REGEXP', '[a-z]', null, true, true)).toBeInstanceOf(Component);
			expect(Component.create('VARIANT', 'testValue')).toBeInstanceOf(Component);
		});

		test('Testing constructor', () => {
			expect(new Component('STRING', 'testValue', 'testName', true, false)).toBeInstanceOf(Component);
			expect(new Component('REGEXP', '[a-z]', null, true, true)).toBeInstanceOf(Component);
			expect(new Component('VARIANT', 'testValue')).toBeInstanceOf(Component);
		});

		test('Testing get type', () => {
			expect(Component.create('STRING', 'testValue', 'testName', true, false).type).toBe('STRING');
			expect(Component.create('REGEXP', '[a-z]', null, true, true).type).toBe('REGEXP');
			expect(Component.create('VARIANT', 'testValue').type).toBe('VARIANT');
		});

		test('Testing get value', () => {
			expect(Component.create('STRING', 'testValue', 'testName', true, false).value).toBe('testValue');
			expect(Component.create('REGEXP', '[a-z]', null, true, true).value).toBe('[a-z]');
			expect(Component.create('VARIANT', 'testValue').value).toBe('testValue');
		});

		test('Testing get name', () => {
			expect(Component.create('STRING', 'testValue', 'testName', true, false).name).toBe('testName');
			expect(Component.create('REGEXP', '[a-z]', null, true, true).name).toBe(null);
			expect(Component.create('VARIANT', 'testValue').name).toBe(null);
		});

		test('Testing get greedy', () => {
			expect(Component.create('STRING', 'testValue', 'testName', true, false).greedy).toBe(true);
			expect(Component.create('REGEXP', '[a-z]', null, true, true).greedy).toBe(true);
			expect(Component.create('VARIANT', 'testValue', null, true, true).greedy).toBe(true);
		});

		test('Testing get optional', () => {
			expect(Component.create('STRING', 'testValue', 'testName', true, false).optional).toBe(false);
			expect(Component.create('REGEXP', '[a-z]', null, true, true).optional).toBe(true);
			expect(Component.create('VARIANT', 'testValue').optional).toBe(false);
		});

		test('Testing toJSON', () => {
			expect(Component.create('STRING', 'testValue', 'testName', true, false).toJSON()).toEqual({
				type: 'STRING',
				value: 'testValue',
				name: 'testName',
				greedy: true,
				optional: false,
			});
			expect(Component.create('REGEXP', '[a-z]', null, true, true).toJSON()).toEqual({
				type: 'REGEXP',
				value: '[a-z]',
				name: null,
				greedy: true,
				optional: true,
			});
			expect(Component.create('VARIANT', 'testValue').toJSON()).toEqual({
				type: 'VARIANT',
				value: 'testValue',
				name: null,
				greedy: true,
				optional: false,
			});
		});
	});

	describe('Testing Component', () => {
		const prefix = PrefixComponent.create('REGEXP', '\\s+', 'testName', true, false);

		test('Testing static create', () => {
			expect(Component.create('STRING', 'testValue', 'testName', true, false, prefix)).toBeInstanceOf(Component);
		});

		test('Testing constructor', () => {
			expect(new Component('STRING', 'testValue', 'testName', true, false, prefix)).toBeInstanceOf(Component);
		});

		test('Testing get prefix', () => {
			expect(Component.create('STRING', 'testValue', 'testName', true, false, prefix).prefix).toBe(prefix);
		});

		test('Testing toJSON', () => {
			expect(Component.create('STRING', 'testValue', 'testName', true, false, prefix).toJSON()).toEqual({
				type: 'STRING',
				value: 'testValue',
				name: 'testName',
				greedy: true,
				optional: false,
				prefix: {
					type: 'REGEXP',
					value: '\\s+',
					name: 'testName',
					greedy: true,
					optional: false,
				},
			});
		});
	});
});
