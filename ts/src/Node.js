export class Node {
	#type;
	#raw;
	#children;
	#range;

	static create(raw, children) {
		return children.match(
			children => new Node("MATCH", raw, children, [0, raw.length - 1]),
			() => new Node("RECOVER", raw, {}, [0, raw.length - 1])
		);
	}
	static createFollowerWith(precedingNode, raw, children) {
		return precedingNode.match(
			precedingNode => precedingNode.createFollower(raw, children),
			() => Node.create(raw, children)
		);
	}

	constructor(type, raw, children, range) {
		this.#type = type;
		this.#raw = raw;
		this.#children = children;
		this.#range = range;
	}

	get type() {
		return this.#type;
	}

	get raw() {
		return this.#raw;
	}

	get children() {
		return this.#children;
	}

	get range() {
		return this.#range;
	}

	createFollower(raw, children) {
		return children.match(
			children => new Node("MATCH", raw, children, [this.range[1] + 1, this.range[1] + raw.length]),
			() => new Node("RECOVER", raw, {}, [this.range[1] + 1, this.range[1] + raw.length])
		);
	}
}

module.exports = { Node };