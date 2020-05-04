import { _, A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y, Z } from './symbols';
import { hasKey, isObject } from './util';

export type Placeholder = { name: string; symbol: Symbol };

const namedPlaceholders = [
  A, B, C, D, E, F, G, H, I, J, K, L, M,
  N, O, P, Q, R, S, T, U, V, W, X, Y, Z,
];

const symbolsByName: Record<string, Symbol> = namedPlaceholders.reduce(
  (acc, { symbol, name }) => ({ ...acc, [name]: symbol }), {},
);

const lookup = (name: string): Symbol | undefined => symbolsByName[name];

const isNamedPlaceholder = (value: any): boolean => {
  if (!isObject(value)) {
    return false;
  }
  if (!(hasKey(value, 'symbol') && hasKey(value, 'name'))) {
    return false;
  }
  return lookup(value.name) === value.symbol;
};

const isUnnamedPlaceholder = (value: any): boolean => {
  if (!isObject(value)) {
    return false;
  }
  return value.symbol === _.symbol;
};

const isPlaceholder = (value: any): boolean => (
  isUnnamedPlaceholder(value) || isNamedPlaceholder(value)
);

export {
  isNamedPlaceholder,
  isPlaceholder,
  isUnnamedPlaceholder,
};
