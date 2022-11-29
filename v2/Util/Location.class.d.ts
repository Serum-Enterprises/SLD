import * as Position from './Position.class';

export interface LocationJSON {
	start: Position.PositionJSON;
	end: Position.PositionJSON;
}

export class Location {
	public static calculateLocation(precedingLocation: Location | null, codeString: string): Location;

	public constructor(start: Position.Position, end: Position.Position);

	public get start(): Position.Position;
	public get end(): Position.Position;

	public clone(): Location;
	public toJSON(): LocationJSON;
	public toString(): string;
}