import { grammar } from './expression';

const source = '1 * 2 + 3 / 4';

console.log(`Source is: ${source}`);
console.log(`Source length is: ${source.length}`);

// Expecting Output {}
console.log(JSON.stringify(grammar.parse(source, 'expression').toJSON(), null, 2));