import { curry } from 'ramda';

import { Match, Pattern } from '../types';
import { _match } from './matchInternal';

/**
 * Matches `pattern` against `value` and returns the result.
 *
 * @param pattern: A pattern
 * @param value: A data structure or function
 *
 * @returns Two-element array [`isMatch`, `matches`]
 *
 * @example
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
const match = curry(
  (pattern: Pattern, value: any): [boolean, Match] => _match(pattern, value),
);

export { match };
