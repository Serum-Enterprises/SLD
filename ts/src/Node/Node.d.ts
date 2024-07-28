import { Option } from '../../Option/Option';

export class Node {
	static create(raw: string, children: Option<{ [key: string]: Node[] }>): Node;
	static createFollowerWith(precedingNode: Option<Node>, raw: string, children: Option<{ [key: string]: Node[] }>): Node;

	private constructor(type: "MATCH" | "RECOVER", raw: string, children: { [key: string]: Node[] }, range: [number, number]);

	get type(): "MATCH" | "RECOVER";
	get raw(): string;
	get children(): { [key: string]: Node[] };
	get range(): [number, number];

	createFollower(raw: string, children: Option<{ [key: string]: Node[] }>): Node;
}