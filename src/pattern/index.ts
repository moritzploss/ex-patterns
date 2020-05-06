import { equals } from 'ramda';

import { isUnnamedPlaceholder, isNamedPlaceholder, isPlaceholder } from '../placeholder';
import { updateMatch, Match } from '../match';
import { matchArray } from './array';
import { matchMap, matchObject } from './map';
import { isObject, isArray, isMap, isList } from '../util';

import { Pattern } from './types';

const _match = (pattern: Pattern, value: any, matches = {}) => {
  if (isPlaceholder(value)) {
    throw Error('Right side of match cannot contain placeholder.');
  }

  if (isUnnamedPlaceholder(pattern)) {
    return [true, matches];
  }

  if (isNamedPlaceholder(pattern)) {
    return updateMatch(matches, pattern, value);
  }

  if (equals(pattern, value)) {
    return [true, matches];
  }

  if (isArray(pattern)) {
    if (isList(value)) {
      const getElement = (index: number) => value.get(index);
      return matchArray(pattern, value, value.size, getElement, _match, matches);
    }
    if (isArray(value)) {
      const getElement = (index: number) => value[index];
      return matchArray(pattern, value, value.length, getElement, _match, matches);
    }
  }

  if (isObject(pattern)) {
    if (isMap(value)) {
      return matchMap(pattern, value, _match, matches);
    }
    if (isObject(value)) {
      return matchObject(pattern, value, _match, matches);
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
  return match(pattern, value)[0];
}

export { match, isMatch };
