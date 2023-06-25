export class MisMatchError extends Error {
	private _index: number;

	constructor(message: string, index: number) {
		super(message);

		this._index = index;
	}

	get index() {
		return this._index;
	}
}