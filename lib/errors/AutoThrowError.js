class AutoThrowError extends Error {
    #index = 0;

    /**
     * Create a new AutoThrow Error
     * @param {string} message 
     * @param {number} index 
     */
    constructor(message, index) {
        if (typeof message !== 'string')
            throw new TypeError('Expected message to be a String');

        if (!Number.isSafeInteger(index))
            throw new TypeError('Expected index to be an Integer');

        if (index < 0)
            throw new RangeError('Expected index to be greater than or equal to 0');

        super(message);
        this.#index = index;
    }

    /**
     * Get the Index
     * @returns {number}
     */
    get index() {
        return this.#index;
    }
}

module.exports = AutoThrowError;
