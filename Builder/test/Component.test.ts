import { BaseComponent, ComponentSet } from '../src/Component';

describe('Testing Component', () => {
	describe('Testing BaseComponent', () => {
		test('Testing static create', () => {
			expect(BaseComponent.create('STRING', 'testValue')).toBeInstanceOf(BaseComponent);
			expect(BaseComponent.create('STRING', 'testValue', 'testName')).toBeInstanceOf(BaseComponent);
			expect(BaseComponent.create('REGEXP', '[a-z]')).toBeInstanceOf(BaseComponent);
			expect(BaseComponent.create('REGEXP', '[a-z]', 'testName')).toBeInstanceOf(BaseComponent);
		});

		test('Testing constructor', () => {
			expect(new BaseComponent('STRING', 'testValue')).toBeInstanceOf(BaseComponent);
			expect(new BaseComponent('STRING', 'testValue', 'testName')).toBeInstanceOf(BaseComponent);
			expect(new BaseComponent('REGEXP', '[a-z]')).toBeInstanceOf(BaseComponent);
			expect(new BaseComponent('REGEXP', '[a-z]', 'testName')).toBeInstanceOf(BaseComponent);
		});

		test('Testing get type', () => {
			expect(BaseComponent.create('STRING', 'testValue').type).toBe('STRING');
			expect(BaseComponent.create('REGEXP', '[a-z]').type).toBe('REGEXP');
		});

		test('Testing get value', () => {
			expect(BaseComponent.create('STRING', 'testValue').value).toBe('testValue');
			expect(BaseComponent.create('REGEXP', '[a-z]').value).toBe('[a-z]');
		});

		test('Testing get name', () => {
			expect(BaseComponent.create('STRING', 'testValue', 'testName').name).toBe('testName');
			expect(BaseComponent.create('REGEXP', '[a-z]', 'testName').name).toBe('testName');
		});

		test('Testing toJSON', () => {
			expect(BaseComponent.create('STRING', 'testValue').toJSON()).toEqual({
				type: 'STRING',
				value: 'testValue',
				name: null,
			});
			expect(BaseComponent.create('REGEXP', '[a-z]').toJSON()).toEqual({
				type: 'REGEXP',
				value: '[a-z]',
				name: null,
			});
			expect(BaseComponent.create('REGEXP', '[a-z]', 'testName').toJSON()).toEqual({
				type: 'REGEXP',
				value: '[a-z]',
				name: 'testName',
			});
		});
	});

	describe('Testing ComponentSet', () => {
		const baseComponent1 = BaseComponent.create('STRING', 'testValue1');
		const baseComponent2 = BaseComponent.create('STRING', 'testValue2', 'testName');

		test('Testing static create', () => {
			expect(ComponentSet.create([baseComponent1, baseComponent2], true, true)).toBeInstanceOf(ComponentSet);
		});

		test('Testing constructor', () => {
			expect(new ComponentSet([baseComponent1, baseComponent2], false, true)).toBeInstanceOf(ComponentSet);

		});

		test('Testing get components', () => {
			expect(ComponentSet.create([baseComponent1, baseComponent2], true, true).components).toEqual([baseComponent1, baseComponent2]);
		});

		test('Testing get greedy', () => {
			expect(ComponentSet.create([baseComponent1, baseComponent2], true, false).greedy).toBe(true);
		});

		test('Testing get optional', () => {
			expect(ComponentSet.create([baseComponent1, baseComponent2], true, false).optional).toBe(false);
		});

		test('Testing toJSON', () => {
			expect(ComponentSet.create([baseComponent1, baseComponent2], true, false).toJSON()).toEqual({
				components: [
					{
						type: 'STRING',
						value: 'testValue1',
						name: null,
					},
					{
						type: 'STRING',
						value: 'testValue2',
						name: 'testName',
					}
				],
				greedy: true,
				optional: false
			});
		});
	});
});
