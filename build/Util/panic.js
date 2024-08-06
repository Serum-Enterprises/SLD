"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.panic = void 0;
function panic(message) {
    process.stderr.write(`Panic: ${message}\n`);
    const stack = (new Error()).stack?.split('\n');
    if (!stack)
        process.exit(1);
    for (let i = 2; i < stack.length; i++)
        process.stderr.write(`${stack[i]}\n`);
    process.exit(1);
}
exports.panic = panic;
