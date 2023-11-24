export interface NodeInterface {
	type: 'MATCH' | 'RECOVER';
	raw: string;
	children: { [key: string]: NodeInterface[] };
	range: [number, number];
}