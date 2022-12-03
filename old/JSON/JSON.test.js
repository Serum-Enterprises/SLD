const JSONParser = require('./JSON');
const fs = require('fs');

const raw = {
	primitive: {
		a: null,
		b: true,
		c: 123,
		d: 123.123,
		e: 'abc',
	},
	container: {
		a: [{
			a: null,
			b: true,
			c: 123,
			d: 123.123,
			e: 'abc',
		}, null, true, 123, 123.123, 'abc'],
		b: {
			a: null,
			b: true,
			c: 'Hello World',
			b: {
				a: null,
				b: true,
				c: 123,
				d: 123.123,
				e: 'abc',
			}
		}
	}
}

const rawString = JSON.stringify(raw);

const parsed = JSONParser.JSON(rawString);

const parsedString = JSON.stringify(parsed, null, 2);

fs.writeFileSync('./JSON.test.json', parsedString);