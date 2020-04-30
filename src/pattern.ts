import * as R from 'ramda';

import { reduceWhile, ok, stop } from './enum';
import { isPlaceHolder } from './placeholder';

type pattern = any;

const _hasKey = (object: Object, key: string) => (
  Object.prototype.hasOwnProperty.call(object, key)
);

const _isArray = (value) => Array.isArray(value);

const _isObject = (value) => typeof value === 'object' && value !== null;

const _matchArray = (pattern, value, match) => {
  if (pattern.length > value.length) {
    return [false, {}];
  }
  const isMatch = reduceWhile(pattern, true, (acc: boolean, element: pattern, index: number) => {
    const [isMatch, matches] = match(element, value[index]);
    return isMatch ? [ok, true] : [stop, false];
  });
  return isMatch ? [true, {}] : [false, {}];
};

const _matchObject = (pattern, value, match) => {
  const enumerator = Object.entries(pattern);
  const isMatch = reduceWhile(enumerator, true, (acc: boolean, [key, val]: [string, pattern]) => {
    if (key === '_' || isPlaceHolder(key)) {
      throw Error('Object keys cannot be placeholders.');
    }
    if (_hasKey(value, key)) {
      const [isMatch, matches] = match(val, value[key]);
      if (isMatch) {
        return [ok, true];
      }
    }
    return [stop, false];
  });
  return isMatch ? [true, {}] : [false, {}];
};

const match = (pattern: pattern, value: any) => {
  if (isPlaceHolder(value)) {
    throw Error('Right side of match cannot contain placeholders.');
  }

  if (isPlaceHolder(pattern)) {
    return [true, {}];
  }

  if (typeof value === 'string' && pattern instanceof RegExp) {
    const isMatch = pattern.test(value);
    return isMatch ? [true, {}] : [false, {}];
  }

  if (R.equals(pattern, value)) {
    return [true, {}];
  }

  if (_isArray(pattern) && _isArray(value)) {
    return _matchArray(pattern, value, match);
  }

  if (_isObject(pattern) && _isObject(value)) {
    return _matchObject(pattern, value, match);
  }

  return [false, {}];
};

export { match };
