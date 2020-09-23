import { curry } from 'ramda';

import { Pattern } from '../types';

import { match } from './match';

/**
 * Matches `pattern` against `value` and returns a boolean indicating whether
 * the match was successful.
 *
 * @param pattern: A pattern
 * @param value: A data structure or function
 *
 * @returns Two-element array `isMatch`
 *
 * @example
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
const isMatch = curry(
  (pattern: Pattern, value: any): boolean => match(pattern, value)[0],
);

export { isMatch };
