export class SLDError extends Error {
	constructor(location: number, message?: string, options?: { cause: unknown });

	get location(): number;
}