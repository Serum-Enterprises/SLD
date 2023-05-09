/**
 * @typedef {null | boolean | number | string} PrimitiveInterface
 * @typedef {Array<JSONInterface> | { [key: string]: JSONInterface }} ContainerInterface
 * @typedef {PrimitiveInterface | ContainerInterface} JSONInterface
 */

class Util {
	/**
	 * Check if value is valid JSON 
	 * @param {JSONInterface} value
	 * @returns {boolean}
	 * @static
	 */
	static isJSON(value) {
		if (value === null || typeof value === 'boolean' || Number.isFinite(value) || typeof value === 'string')
			return true;

		if (Array.isArray(value))
			return value.every(Util.isJSON);

		if (Object.prototype.toString.call(value) === '[object Object]')
			return Object.values(value).every(Util.isJSON);

		return false;
	}

	/**
	 * Perform a deep clone of value. Throws a TypeError if value is not valid JSON.
	 * @param {JSONInterface} value
	 * @returns {JSONInterface}
	 * @static
	 */
	static cloneJSON(value) {
		if (value === null || typeof value === 'boolean' || Number.isFinite(value) || typeof value === 'string')
			return value;

		if (Array.isArray(value))
			return value.reduce((result, item) => {
				return [...result, Util.cloneJSON(item)];
			}, []);

		if (Object.prototype.toString.call(value) === '[object Object]')
			return Object.entries(value).reduce((result, [key, value]) => {
				return { ...result, [key]: Util.cloneJSON(value) };
			}, {});

		throw new TypeError(`Expected value to be valid JSON`);
	}
}

module.exports = Util;