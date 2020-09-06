const generatePlaceholder = (name: string) => ({
  lookupName: name,
  symbol: Symbol(name),
});

export const generateNamedPlaceholder = (name: string) => {
  const placeholder = generatePlaceholder(name);
  const placeholderFun = (subPattern: any = placeholder) => ({ subPattern, ...placeholder });
  return Object.assign(placeholderFun, placeholder);
};

export const _ = generatePlaceholder('_');

export const A = generateNamedPlaceholder('A');
export const B = generateNamedPlaceholder('B');
export const C = generateNamedPlaceholder('C');
export const D = generateNamedPlaceholder('D');
export const E = generateNamedPlaceholder('E');
export const F = generateNamedPlaceholder('F');
export const G = generateNamedPlaceholder('G');
export const H = generateNamedPlaceholder('H');
export const I = generateNamedPlaceholder('I');
export const J = generateNamedPlaceholder('J');
export const K = generateNamedPlaceholder('K');
export const L = generateNamedPlaceholder('L');
export const M = generateNamedPlaceholder('M');
export const N = generateNamedPlaceholder('N');
export const O = generateNamedPlaceholder('O');
export const P = generateNamedPlaceholder('P');
export const Q = generateNamedPlaceholder('Q');
export const R = generateNamedPlaceholder('R');
export const S = generateNamedPlaceholder('S');
export const T = generateNamedPlaceholder('T');
export const U = generateNamedPlaceholder('U');
export const V = generateNamedPlaceholder('V');
export const W = generateNamedPlaceholder('W');
export const X = generateNamedPlaceholder('X');
export const Y = generateNamedPlaceholder('Y');
export const Z = generateNamedPlaceholder('Z');

export const namedPlaceholders = [
  A, B, C, D, E, F, G, H, I, J, K, L, M,
  N, O, P, Q, R, S, T, U, V, W, X, Y, Z,
];

export const end = Symbol('end');
export type End = typeof end;

export const otherwise = Symbol('otherwise');
export type Otherwise = typeof otherwise;

export const thenSymbol = Symbol('then');
export type ThenSymbol = typeof thenSymbol;

export const tailSymbol = Symbol('tail');
export const headSymbol = Symbol('head');

export const reservedStrings = ['tail', 'head', '_'];
