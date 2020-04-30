import * as R from 'ramda';

import { reduceWhile, ok, stop } from './enum';
import { isUnderscore, isNamedPlaceHolder, isPlaceHolder } from './placeholder';
import { updateMatch, Match } from './match';
import { hasKey, isObject, isArray } from './util';

export type Pattern = any;
type MatchTuple = [boolean, Match];

const _matchArray = (pattern: Pattern, array: [], matchFunc: Function, match: Match) => {
  if (pattern.length > array.length) {
    return [false, {}];
  }
  return reduceWhile(pattern, [true, match], ([isMatch, acc]: MatchTuple, elm: any, i: number) => {
    // eslint-disable-next-line no-param-reassign
    [isMatch, acc] = matchFunc(elm, array[i], acc);
    return isMatch
      ? [ok, [true, acc]]
      : [stop, [false, {}]];
  });
};

const _matchObject = (pattern: Pattern, object: Object, matchFunc: Function, match: Match) => {
  const keyVal = Object.entries(pattern);
  const reducer = ([isMatch, acc]: MatchTuple, [key, val]: [string, Pattern]) => {
    if (key === '_' || isPlaceHolder(key)) {
      throw Error('Object keys cannot be placeholders.');
    }
    if (hasKey(object, key)) {
      // eslint-disable-next-line no-param-reassign
      [isMatch, acc] = matchFunc(val, object[key], acc);
      if (isMatch) {
        return [ok, [true, acc]];
      }
    }
    return [stop, [false, {}]];
  };
  return reduceWhile(keyVal, [true, match], reducer);
};

const match = (pattern: Pattern, value: any, matches = {}) => {
  if (isPlaceHolder(value)) {
    throw Error('Right side of match cannot contain placeholders.');
  }

  if (isUnderscore(pattern)) {
    return [true, matches];
  }

  if (isNamedPlaceHolder(pattern)) {
    return updateMatch(matches, pattern, value);
  }

  if (R.equals(pattern, value)) {
    return [true, matches];
  }

  if (isArray(pattern) && isArray(value)) {
    return _matchArray(pattern, value, match, matches);
  }

  if (isObject(pattern) && isObject(value)) {
    return _matchObject(pattern, value, match, matches);
  }

  return [false, matches];
};

export { match };
