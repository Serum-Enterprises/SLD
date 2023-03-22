export enum TYPE {
	ERROR = 'ERROR',
	MISMATCH = 'MISMATCH',
}

export interface Problem {
	type: TYPE,
	message: string
}

export function create(type: TYPE, message: string): Problem {
	return {
		type: type,
		message: message
	};
}