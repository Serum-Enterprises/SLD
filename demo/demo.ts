import * as fs from 'fs';

import { output as simpleOutput } from './simple';
import { output as throwOutput } from './throw';
import { output as transformOutput } from './transform';
import { output as nestedOutput } from './nested';

fs.mkdirSync('./demo', { recursive: true });

fs.writeFileSync('./demo/simple.json', JSON.stringify(simpleOutput, null, 2));
fs.writeFileSync('./demo/throw.json', JSON.stringify(throwOutput, null, 2));
fs.writeFileSync('./demo/transform.json', JSON.stringify(transformOutput, null, 2));
fs.writeFileSync('./demo/nested.json', JSON.stringify(nestedOutput, null, 2));