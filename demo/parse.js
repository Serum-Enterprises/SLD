"use strict";
const grammar = require('./expression');
console.log(JSON.stringify(grammar.parse('1 + 1', 'expression').toJSON(), null, 2));
