const Result = require('../Util/Result.class');

const Core = {
	Identifier: codeString => {
		const match = codeString.match(/^[a-zA-Z_]+/u);

		if(!match)
			return null;

		return new Result('Identifier', match[0], codeString.slice(match[0].length));
	}
}

module.exports = Core;