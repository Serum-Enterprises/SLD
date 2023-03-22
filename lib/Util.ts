type JSON_T = null | boolean | number | string | Array<JSON_T> | { [key: string]: JSON_T };

function printCharTable(str: string) {
	console.table(str.split(/\n/)
		.map((line, index, lines) => {
			const lineWithEnding = line + (index !== lines.length - 1 ? '\n' : '');
			return lineWithEnding.split('');
		})
		.reduce((result, line, i) => {
			return {
				...result,
				[i]: line.reduce((result, char, j) => {
					return {
						...result,
						[j]: char
					};
				}, {})
			};
		}, {})
	);
}