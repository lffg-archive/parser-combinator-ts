export type SuccessParserResult<T> = { ok: true; data: T; rest: string };
export type ErrorParserResult = { ok: false; expected: string; actual: string };
export type ParserResult<T> = SuccessParserResult<T> | ErrorParserResult;
export type Parser<T> = (input: string) => ParserResult<T>;

export type ParserDataList<Parsers extends readonly Parser<unknown>[]> = {
  [I in keyof Parsers]: Parsers[I] extends Parser<infer T> ? T : never;
};
