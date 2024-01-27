const { Parser } = require('./src/Parser');
const { Node } = require('./src/Node');
const { MisMatchError } = require('./src/errors/MisMatchError');
const { VariantError } = require('./src/errors/VariantError');
const { CustomError } = require('./src/errors/CustomError');

module.exports = { Parser, Node, MisMatchError, VariantError, CustomError };