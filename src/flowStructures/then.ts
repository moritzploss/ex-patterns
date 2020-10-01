import { thenSymbol } from '../symbols';
import { hasKey } from '../util';

/**
 * Wrapper for callback functions in `when` clauses. It's just syntactic
 * sugar; the callback function can also be passed in without `then`.
 *
 * @param callback: A callback function
 *
 * @returns The `callback` function.
 *
 *
 * @example
 * Use `when` to pattern match against `value`. The callback function that belongs
 * to the first matching pattern is invoked and the result is returned.
 * ```
 *      const value = [1, 'bar'];
 *      when(value)
 *         ([1, 1], then(() => 'foo'))    // with `then`
 *         ([1, A], () => 'bar')         // without `then`
 *         (_, then(() => 'baz'))         // with `then`
 *      (end);
 *      > 'bar'
 * ```
 */
function then<T>(func: T): T {
  return func;
}

then.symbol = thenSymbol;

const isThen = (maybeThen: any) => (
  hasKey(maybeThen, 'symbol') && maybeThen.symbol === thenSymbol
);

export { then, isThen };
