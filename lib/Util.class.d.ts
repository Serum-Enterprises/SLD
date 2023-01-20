export type JSON_T = null | boolean | number | string | JSON_T[] | { [key: string]: JSON_T };

export class CloneError extends Error {}

export class Util {
	static get CloneError(): typeof CloneError;

	static isJSON(data: JSON_T): boolean;
	static cloneJSON(data: JSON_T): JSON_T;

	static printCharTable(str: string): void;
}