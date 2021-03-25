import { repl } from '../utils/io';
import * as p from './basic';
import type { Parser } from './basic-types';

const plusToken = p.text('+');
const numberToken = p.regex(/\d+(?:\.\d+)?/);
const number = p.map(Number, numberToken);

const sum: Parser<number> = p.apply((x1, _, x2) => x1 + x2, [
  number,
  plusToken,
  number
]);

if (!process.env.NODE_ENV) {
  repl('> ', (input, exit) => {
    if (input === '.exit') exit();
    console.log(p.parse(sum, input));
  });
}
