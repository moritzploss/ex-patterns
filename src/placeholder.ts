import { _, A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y, Z } from './symbols';
import { hasKey, isObject } from './util';
import { Placeholder } from './types';

const namedPlaceholders = [
  A, B, C, D, E, F, G, H, I, J, K, L, M,
  N, O, P, Q, R, S, T, U, V, W, X, Y, Z,
];

const symbolsByName: Record<string, Symbol> = namedPlaceholders.reduce(
  (acc, { symbol, lookupName }) => ({ ...acc, [lookupName]: symbol }), {},
);

const lookup = (lookupName: Placeholder['lookupName']): Symbol | undefined => (
  symbolsByName[lookupName]
);

const isNamedPlaceholder = (value: any): boolean => {
  if (value === null || value === undefined) {
    return false;
  }
  if (!(hasKey(value, 'symbol') && hasKey(value, 'lookupName'))) {
    return false;
  }
  return lookup(value.lookupName) === value.symbol;
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
