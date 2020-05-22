import { equals } from 'ramda';
import { List } from 'immutable';

import { isUnnamedPlaceholder, isNamedPlaceholder, isPlaceholder } from '../placeholder';
import { updateMatch, Match } from '../match';
import { matchArray } from './array';
import { matchMap } from './map';
import { isObject, isArray, isMap, isList, isFunction, hasKey } from '../util';

import { Pattern } from './types';

const matchNamedPlaceholder = (pattern: Pattern, value: any, matches: Match, _match: Function) => {
  // placeholder is used as is
  if (isFunction(pattern)) {
    return updateMatch(matches, pattern, value);
  }
  // placeholder is used for parent capturing and has been called with subPattern
  const [isSuccess, newMatches] = updateMatch(matches, pattern, value);
  if (isSuccess) {
    // if parent capture was successful, continue to match against subPattern
    return _match(pattern.subPattern, value, newMatches);
  }
  return [false, newMatches];
};

const _match = (pattern: Pattern, value: any, matches = {}) => {
  if (isPlaceholder(value)) {
    throw Error('Right side of match cannot contain placeholder.');
  }

  if (isUnnamedPlaceholder(pattern)) {
    return [true, matches];
  }

  if (isNamedPlaceholder(pattern)) {
    return matchNamedPlaceholder(pattern, value, matches, _match);
  }

  if (equals(pattern, value)) {
    return [true, matches];
  }

  if (isArray(pattern)) {
    if (isList(value)) {
      const get = (list: List<any>, index: number) => list.get(index);
      return matchArray(pattern, value, value.size, get, _match, matches);
    }
    if (isArray(value)) {
      const get = (array: Array<any>, index: number) => array[index];
      return matchArray(pattern, value, value.length, get, _match, matches);
    }
  }

  if (isObject(pattern)) {
    if (isMap(value)) {
      const has = (map: Map<string, any>, key: string) => map.has(key);
      const get = (map: Map<string, any>, key: string) => map.get(key);
      return matchMap(pattern, value, _match, matches, has, get);
    }
    if (isObject(value)) {
      const get = (map: Object, key: string) => map[key];
      return matchMap(pattern, value, _match, matches, hasKey, get);
    }
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

/**
 * Matches `pattern` against `value` and returns a boolean indicating whether
 * the match was successful.
 *
 * @param pattern: A pattern
 * @param value: A data structure or function
 *
 * @returns Two-element array `isMatch`
 *
 * ## Examples
 * Successful match against the unnamed placeholder `_`:
 * ```
 *      const pattern = [_, 2];
 *      const value   = [1, 2];
 *      match(pattern, value);
 *      > true
 * ```
 * Unsuccessful match:
 * ```
 *      const pattern = [_, 3];
 *      const value   = [1, 2];
 *      match(pattern, value);
 *      > false
 * ```
 * Successful match against the named placeholders `A`, `B`, and `C`:
 * ```
 *      const pattern = [A, 2, B, C];
 *      const value   = [1, 2, 3, 4];
 *      match(pattern, value);
 *      > true
 * ```
 */
function isMatch(pattern: Pattern, value: any): boolean {
  return _match(pattern, value)[0];
}

export { match, isMatch, _match };
