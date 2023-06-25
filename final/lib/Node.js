class TYPE {
    static get MATCH() {
        return "MATCH";
    }
    static get RECOVER() {
        return "RECOVER";
    }
}

class Node {
    #type = 'MATCH';
    #raw = '';
    #children = {};
    #range = [0, 0];

    constructor(type, raw, children, range) {
        if (typeof type !== 'string')
            throw new TypeError('Expected type to be a String');

        if (!['MATCH', 'RECOVER'].includes(type))
            throw new RangeError('Expected type to be either "MATCH" or "RECOVER"');

        if (typeof raw !== 'string')
            throw new TypeError('Expected raw to be a String');

        if (Object.prototype.toString.call(children) !== '[object Object]')
            throw new TypeError('Expected children to be an Object');

        Object.entries(children).forEach(([key, value]) => {
            if (!((value instanceof Node) || (Array.isArray(value) && value.every(child => child instanceof Node))))
                throw new TypeError(`Expected children[${key}] to be an instance of Node or an Array of Node Instances`);
        });

        if (!(Array.isArray(range) && range.length === 2 && range.every(value => Number.isSafeInteger(value))))
            throw new TypeError('Expected range to be an Array of two Integers');

        this.#type = type;
        this.#raw = raw;
        this.#children = children;
        this.#range = range;
    }

    get type() {
        return this.#type;
    }

    get raw() {
        return this.#raw;
    }

    get children() {
        return this.#children;
    }

    get range() {
        return this.#range;
    }

    toJSON() {
        return {
            type: this.#type,
            value: this.#raw,
            children: this.#children,
            range: this.#range
        };
    }
}

module.exports = { TYPE, Node };