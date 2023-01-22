const JSON_P = require('./JSON');
const Util = require('../Util/Rule/Util.class');

const exampleData = {
	gloassary: {
		title: 'example glossary',
		GlossDiv: {
			title: 'S',
			GlossList: {
				GlossEntry: {
					ID: 'SGML',
					SortAs: 'SGML',
					GlossTerm: 'Standard Generalized Markup Language',
					Acronym: 'SGML',
					Abbrev: 'ISO 8879:1986',
					GlossDef: {
						para: 'A meta-markup language, used to create markup languages such as DocBook.',
						GlossSeeAlso: ['GML', 'XML']
					},
					GlossSee: 'markup'
				}
			}
		}
	}
}

const exampleDataString = JSON.stringify(exampleData, null, 2);

const parsedData = JSON_P.JSON(null, exampleDataString);

console.log(JSON.stringify(parsedData, null, 4));