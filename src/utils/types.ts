export type Cast<A, B> = A extends B ? A : B;

export type Narrowable = number | bigint | boolean;

export type Narrow<A> = Cast<
  A,
  [] | (A extends Narrowable ? A : never) | { [K in keyof A]: Narrow<A[K]> }
>;
