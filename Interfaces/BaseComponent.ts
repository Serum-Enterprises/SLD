export interface BaseComponentInterface {
	type: 'STRING' | 'REGEXP' | 'VARIANT';
	value: string;
	name: string | null;
}