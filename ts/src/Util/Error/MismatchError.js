const { SLDError } = require("./SLDError");

class MismatchError extends SLDError { }

module.exports = { MismatchError };