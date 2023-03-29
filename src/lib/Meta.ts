export interface Range {
	start: number,
	end: number
}

export interface Position {
	line: number,
	column: number
}

export interface Location {
	start: Position,
	end: Position,
	next: Position
}

export interface Meta {
	range: Range,
	location: Location
}

function splitSource(source: string): Array<string> {
	return source.split(/(\r\n|\r|\n)(?=.*)/g)
		.reduce((acc: Array<string>, value: string, index: number) => {
			if (index % 2 === 0)
				return [...acc, value];
			else {
				acc[acc.length - 1] = acc[acc.length - 1] + value;
				return acc;

			}
		}, [])
		.filter(value => value !== '');
}

function endsWithLineBreak(source: string): number {
	const match = source.match(/(\r\n|\r|\n)$/);
	return match ? match[0].length : 0;
}

export function create(source: string): Meta {
	if (source.length === 0)
		throw new RangeError('Expected source to be a non-empty String');

	const lines: Array<string> = splitSource(source);
	const lineBreakLength = endsWithLineBreak(lines[lines.length - 1]);

	return {
		range: {
			start: 0,
			end: source.length - 1
		},
		location: {
			start: {
				line: 1,
				column: 1
			},
			end: {
				line: lines.length,
				column: lines[lines.length - 1].length - lineBreakLength
			},
			next: {
				line: lineBreakLength ?
					lines.length + 1 :
					lines.length,
				column: lineBreakLength ?
					1 :
					lines[lines.length - 1].length + 1,
			}
		}
	};
}

export function calculate(precedingMeta: Meta, source: string): Meta {
	if (source.length === 0)
		throw new RangeError('Expected source to be a non-empty String');

	const lines = splitSource(source);
	const lineBreakLength = endsWithLineBreak(source);

	return {
		range: {
			start: precedingMeta.range.end + 1,
			end: precedingMeta.range.end + source.length
		},
		location: {
			start: {
				line: precedingMeta.location.next.line,
				column: precedingMeta.location.next.column
			},
			end: {
				line: precedingMeta.location.next.line + lines.length - 1,
				column: lines.length === 1 ?
					precedingMeta.location.next.column + source.length - 1 :
					lines[lines.length - 1].length
			},
			next: {
				line: lineBreakLength ?
					precedingMeta.location.next.line + lines.length :
					precedingMeta.location.next.line + lines.length - 1,
				column: lineBreakLength ?
					1 :
					precedingMeta.location.next.column + lines[lines.length - 1].length - lineBreakLength
			}
		}
	};
}