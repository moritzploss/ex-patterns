import { curry } from 'ramda';

import { hasKey, isObject } from '../util';
import { Placeholder } from '../types';
import { _, generateNamedPlaceholder, reservedStrings } from '../symbols';
import * as store from './store';

const isNamedPlaceholder = (value: any): boolean => {
  if (value === null || value === undefined) {
    return false;
  }
  if (!(hasKey(value, 'symbol') && hasKey(value, 'lookupName'))) {
    return false;
  }
  return store.get(value.lookupName)?.symbol === value.symbol;
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

  const maybePlaceholder = store.get(lookupName);
  if (isNamedPlaceholder(maybePlaceholder)) {
    return maybePlaceholder;
  }

  const placeholder = generateNamedPlaceholder(lookupName);
  store.add(lookupName, placeholder);
  return placeholder;
};

const $ = curry(createNamedPlaceholder);

export {
  $,
  isNamedPlaceholder,
  isPlaceholder,
  isUnnamedPlaceholder,
};
