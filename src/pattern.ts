import * as R from 'ramda';

import { reduceWhile, ok, stop } from './enum';
import { isUnderscore, isNamedPlaceholder, isPlaceholder } from './placeholder';
import { updateMatch, Match } from './match';
import { hasKey, isObject, isArray } from './util';

export type Pattern = any;
type MatchTuple = [boolean, Match];

const _matchArray = (pattern: Pattern, array: [], matchFunc: Function, matches: Match) => {
  if (pattern.length > array.length) {
    return [false, {}];
  }
  return reduceWhile(pattern, [true, matches], ([isMatch, acc]: MatchTuple, elm: any, i: number) => {
    // eslint-disable-next-line no-param-reassign
    [isMatch, acc] = matchFunc(elm, array[i], acc);
    return isMatch
      ? [ok, [true, acc]]
      : [stop, [false, {}]];
  });
};

const _matchObject = (pattern: Pattern, object: Object, matchFunc: Function, matches: Match) => {
  const keyVal = Object.entries(pattern);
  const reducer = ([isMatch, acc]: MatchTuple, [key, val]: [string, Pattern]) => {
    if (hasKey(object, key)) {
      // eslint-disable-next-line no-param-reassign
      [isMatch, acc] = matchFunc(val, object[key], acc);
      if (isMatch) {
        return [ok, [true, acc]];
      }
    }
    return [stop, [false, {}]];
  };
  return reduceWhile(keyVal, [true, matches], reducer);
};

const _match = (pattern: Pattern, value: any, matches = {}) => {
  if (isPlaceholder(value)) {
    throw Error('Right side of match cannot contain placeholders.');
  }

  if (isUnderscore(pattern)) {
    return [true, matches];
  }

  if (isNamedPlaceholder(pattern)) {
    return updateMatch(matches, pattern, value);
  }

  if (R.equals(pattern, value)) {
    return [true, matches];
  }

  if (isArray(pattern) && isArray(value)) {
    return _matchArray(pattern, value, _match, matches);
  }

  if (isObject(pattern) && isObject(value)) {
    return _matchObject(pattern, value, _match, matches);
  }

  return [false, matches];
};

/**
 * Matches `pattern` against `value` and returns the result.
 *
 * @param pattern: A pattern
 * @param value: A data structure or function
 *
 * @returns Two-element array [`isMatch`, `matches`]
 *
 * ## Examples
 * Successful match against the unnamed placeholder `_`:
 * ```
 *      const pattern = [_, 2];
 *      const value   = [1, 2];
 *      match(pattern, value);
 *      > [true, {}]
 * ```
 * Unsuccessful match:
 * ```
 *      const pattern = [_, 3];
 *      const value   = [1, 2];
 *      match(pattern, value);
 *      > [false, {}]
 * ```
 * Successful match against the named placeholders `A`, `B`, and `C`:
 * ```
 *      const pattern = [A, 2, B, C];
 *      const value   = [1, 2, 3, 4];
 *      match(pattern, value);
 *      > [true, { A: 1, B: 3, C: 4 }]
 * ```
 */
function match(pattern: Pattern, value: any): [boolean, Match] {
  return _match(pattern, value);
}

export { match };
