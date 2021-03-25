import type { Narrow } from '../utils/types';
import type {
  Parser,
  ErrorParserResult,
  SuccessParserResult,
  ParserDataList
} from './types';

export function ok<T>(data: T, rest: string): SuccessParserResult<T> {
  return { ok: true, data, rest };
}

export function error(expected: string, actual: string): ErrorParserResult {
  return { ok: false, expected, actual };
}

export function text(str: string): Parser<string> {
  return function textParser(input: string) {
    if (input.startsWith(str)) {
      return ok(str, input.substr(str.length));
    }
    return error(str, input);
  };
}

export function regex(regex: RegExp): Parser<string> {
  const fencedRegex: RegExp =
    regex.source[0] === '^'
      ? regex
      : new RegExp('^' + regex.source, regex.flags);

  return function regexParser(input: string) {
    const match = input.match(fencedRegex);

    // eslint-disable-next-line eqeqeq
    if (match != null) {
      return ok(match[0], input.substr(match[0].length));
    }
    return error(regex.source, input);
  };
}

export function map<U, T>(fn: (state: T) => U, parser: Parser<T>): Parser<U> {
  return function mappedParser(input: string) {
    const result = parser(input);
    if (!result.ok) {
      return result;
    }
    return ok(fn(result.data), result.rest);
  };
}

export function apply<U, Ps extends readonly Parser<unknown>[]>(
  func: (...dataList: ParserDataList<Ps>) => U,
  parsers: Narrow<Ps>
): Parser<U> {
  return function appliedParser(input: string) {
    const dataAcc: any = [];
    let currentInput = input;
    for (const parser of parsers) {
      const result = parser(currentInput);
      if (!result.ok) {
        return result;
      }
      dataAcc.push(result.data);
      currentInput = result.rest;
    }
    return ok(func(...dataAcc), currentInput);
  };
}

export function parse(parser: Parser<any>, input: string): any {
  const result = parser(input);
  if (!result.ok) {
    return new Error(
      'Parsing error.\n' +
        `  Expected '${result.expected}'.\n` +
        `  Instead found '${result.actual}'.`
    );
  }
  return result;
}
