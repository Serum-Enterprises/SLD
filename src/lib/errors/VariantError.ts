export class VariantError extends Error {
	private _index: number;

	public constructor(message: string, index: number) {
		if (index < 0)
			throw new RangeError('Expected index to be greater than or equal to 0');

		super(message);
		this._index = index;
	}

	public get index(): number {
		return this._index;
	}

	public toString(): string {
		return `${this.message} at index ${this._index}`;
	}
}