import { match, Pattern } from './pattern';
import { Match } from './match';
import { end } from './symbols';

type Callback = (matches?: Match, value?: any, pattern?: Pattern) => any;
type Args = [] | [Symbol] | [Pattern, Callback];

const throwArgError = () => {
  throw Error('Expected 1 (end) or 2 (type pattern, type function) arguments.');
};

const _when = (value: any, done = false, result = null) => (...args: Args): any => {
  const argsLength = args.length;

  if (argsLength === 0) {
    throwArgError();
  }

  if (argsLength === 1) {
    if (args[0] === end && done) {
      return result;
    }
    if (args[0] !== end) {
      throwArgError();
    }
    throw Error('No matching clause found. ');
  }

  if (argsLength > 2) {
    throwArgError();
  }

  if (typeof args[1] !== 'function') {
    throw Error(`Expected second argument to be a function (is ${typeof args[1]}).`);
  }

  if (done) {
    return _when(value, true, result);
  }

  const [pattern, callback] = args;
  const [isMatch, matches] = match(pattern, value);
  if (isMatch) {
    return _when(value, true, callback(matches, value, pattern));
  }

  return _when(value);
};

/**
 * Function that can be used as a `switch`-like control flow structure.
 *
 * The `when` function returns a function that can be invoked with a
 * `(pattern, callback)` clause. Several clauses can be chained to form
 * a `switch`-like syntax. To end the chain, pass the `end` keyword to a match
 * clause. Throws an error if no matching clause is found.
 *
 * When a matching clause is found, the corresponding callback function is
 * invoked. The return value of the `callback` function is returned by the `when`
 * structure. Callbacks are invoked with three arguments:
 *
 * 1. the `match` result (type `Object`)
 * 2. the `value` that was matched against (type `any`)
 * 3. the `pattern` that was used to perform the match (type `Pattern`)
 *
 * For example, a `callback` function may look like this:
 *
 * ```
 *      const callback = (match, value, pattern) => ...
 * ```
 * @param value: A data structure or function
 *
 * @returns Function that can be invoked with `(pattern, callback)` or `end`.
 *
 *
 * ## Examples
 * Use `when` to pattern match against `value`. The callback function that belongs
 * to the first matching pattern is invoked and the result is returned.
 * ```
 *      const value = [1, 'bar'];
 *      when(value)
 *         ([1, 1], () => 'foo')    // no match [1, 1] ≠ [1, 'bar']
 *         ([1, A], ({ A }) => A)   // match!   [1, A] = [1, 'bar'] => invoke callback!
 *         (_, () => 'baz')         // fallback      _ = [1, 'bar']
 *      (end);
 *      > 'bar'
 * ```
 */
function when(value: any) {
  return _when(value);
}

export { when };
