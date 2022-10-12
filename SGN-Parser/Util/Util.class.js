class Util {
	static isJSON(data) {
		if(data === null || typeof data === 'boolean' || Number.isFinite(data) || typeof data === 'string')
			return true;
		else if(Array.isArray(data))
			return data.every(Util.isJSON);
		else if(Object.prototype.toString.call(data) === '[object Object]')
			return Object.values(data).every(Util.isJSON);
		else
			return false;
	}

	static trimFront(codeString) {
		return codeString.replace(/^\s+/, '');
	}
}

module.exports = Util;