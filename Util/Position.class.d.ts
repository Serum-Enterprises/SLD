export interface PositionJSON {
	line: number;
	column: number;
}

export class Position {
	public constructor(line: number, column: number);

	public get line(): number;
	public get column(): number;

	public clone(): Position;
	public toJSON(): PositionJSON;
	public toString(): string;
}