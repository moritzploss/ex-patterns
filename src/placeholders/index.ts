import { curry } from 'ramda';
import { Map } from 'immutable';

import { _, A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y, Z } from '../symbols';
import { hasKey, isObject } from '../util';
import { Placeholder } from '../types';
import { generateNamedPlaceholder, reservedStrings } from '../symbols';

const namedPlaceholders = [
  A, B, C, D, E, F, G, H, I, J, K, L, M,
  N, O, P, Q, R, S, T, U, V, W, X, Y, Z,
];

let placeholdersByName = namedPlaceholders.reduce(
  (acc, placeholder) => acc.set(placeholder.lookupName, placeholder),
  Map<string, Placeholder>(),
);

let symbolsByName = placeholdersByName.map(({ symbol }) => symbol);

const isNamedPlaceholder = (value: any): boolean => {
  if (value === null || value === undefined) {
    return false;
  }
  if (!(hasKey(value, 'symbol') && hasKey(value, 'lookupName'))) {
    return false;
  }
  return symbolsByName.get(value.lookupName) === value.symbol;
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

const createNamedPlaceholder = (lookupName: string): Placeholder => {
  if (reservedStrings.includes(lookupName)) {
    throw new Error(`Can't create named placeholder with reserved name '${lookupName}'`);
  }

  const maybePlaceholder = placeholdersByName.get(lookupName);
  if (isNamedPlaceholder(maybePlaceholder)) {
    return maybePlaceholder;
  }

  const placeholder = generateNamedPlaceholder(lookupName);
  symbolsByName = symbolsByName.set(lookupName, placeholder.symbol);
  placeholdersByName = placeholdersByName.set(lookupName, placeholder);
  return placeholder;
};

const $ = curry(createNamedPlaceholder);

export {
  $,
  isNamedPlaceholder,
  isPlaceholder,
  isUnnamedPlaceholder,
};
