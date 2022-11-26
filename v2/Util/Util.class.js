class Util {
	static get CloneError() {
		return class CloneError extends TypeError {};
	}

	static isJSON(data) {
		if (data === null || typeof data === 'boolean' || Number.isFinite(data) || typeof data === 'string')
			return true;
		else if (Array.isArray(data))
			return data.every(JSONUtil.isJSON);
		else if (Object.prototype.toString.call(data) === '[object Object]')
			return Object.values(data).every(JSONUtil.isJSON);
		else
			return false;
	}

	static cloneJSON(data) {
		if (data === null || typeof data === 'boolean' || Number.isFinite(data) || typeof data === 'string')
			return data;
		else if (Array.isArray(data))
			return data.reduce((result, item) => {
				return [...result, JSONUtil.cloneJSON(item)];
			}, []);
		else if (Object.prototype.toString.call(data) === '[object Object]')
			return Object.entries(data).reduce((result, [key, value]) => {
				return { ...result, [key]: JSONUtil.cloneJSON(value) };
			}, {});
		else
			throw new Util.CloneError('Expected data to be valid JSON');
	}

	// Print a String with Index Numbers below the Characters starting with based
	static printIndex(s, based = 0) {
		if(typeof s !== 'string')
			throw new TypeError('Expected s to be a String');

		if(!Number.isSafeInteger(based))
			throw new TypeError('Expected based to be an Integer');

		console.log(
			s.split('')
				.reduce((result, c, i) => {
					return [
						`${result[0]} ${padStart(c, `${i + based}`.length)}`,
						`${result[1]} ${i + based}`
					]
				}, ['', ''])
				.join('\n')
		);
	}
}

module.exports = Util;