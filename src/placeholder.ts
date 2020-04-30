import { reduceWhile, ok, stop } from './enum';
import { _, A, B, C, D, E, F, G, H, I, J, K, L } from './symbols';

export type placeholder = Symbol;

const namedPlaceholders = [A, B, C, D, E, F, G, H, I, J, K, L];

const isUnderscore = (value: any): boolean => value === _;

const isNamedPlaceHolder = (value: any): boolean => {
  if (!(typeof value === 'symbol')) {
    return false;
  }
  return reduceWhile(namedPlaceholders, false, (acc, placeholder: placeholder) => {
    if (value === placeholder) {
      return [stop, true];
    }
    return [ok, false];
  });
};

const isPlaceHolder = (value: any): boolean => isUnderscore(value) || isNamedPlaceHolder(value);

const toString = (placeHolder: Symbol): string => {
  const matches = placeHolder
    .toString()
    .match(/Symbol\((.*)\)/);
  return matches[1];
};

export {
  isUnderscore,
  isPlaceHolder,
  isNamedPlaceHolder,
  namedPlaceholders,
  toString,
  _, A, B, C, D, E, F, G, H, I, J, K, L,
};
