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

	static cloneJSON(data) {
		if(data === null || typeof data === 'boolean' || Number.isFinite(data) || typeof data === 'string')
			return data;
		else if(Array.isArray(data))
			return data.reduce((result, item) => [...result, Util.cloneJSON(item)], []);
		else if(Object.prototype.toString.call(data) === '[object Object]')
			return Object.entries(data).reduce((result, [key, value]) => ({...result, [key]: Util.cloneJSON(value)}), {});
		else
			throw new TypeError('Expected data to be valid JSON');
	}

	static trimFront(codeString) {
		return codeString.replace(/^\s+/u, '');
	}
}

module.exports = Util;