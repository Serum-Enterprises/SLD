export interface RangeJSON {
	start: number;
	end: number;
}

export class Range {
	public constructor(start: number, end: number);

	public get start(): number;
	public get end(): number;

	public clone(): Range;
	public toJSON(): RangeJSON;
	public toString(): string;
}