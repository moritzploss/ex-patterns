import { match } from './pattern';
import { _, end } from './symbols';

const throwArgError = () => {
  throw Error('Expected 1 (end) or 2 (type pattern, type function) arguments.');
};

const _when = (value, done = false, result = null) => (...args: [any?, Function?]) => {
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
 * Function that can be used as a `switch`-like control flow structure. It
 * returns a function that can be invoked with `(pattern, callback)` or `end`.
 * When the returned function is invoked with `end`, the result of the matching
 * `callback` is returned. Throws an error if no matching clause is found.
 *
 * @param value: A data structure or function
 *
 * @returns Function that can be invoked with `(pattern, callback)` or `end`
 *
 * ## Examples
 * Use `when` to pattern match against `value`. The callback function that belongs
 * to the first matching pattern is invoked and the result is returned.
 * ```
 *     const value = [1, 'bar'];
 *     when(value)
 *        ([1, 1], () => 'foo')    // no match [1, 1] ≠ [1, 'bar']
 *        ([1, A], ({ A }) => A)   // match!   [1, A] = [1, 'bar'] => invoke callback!
 *        (_, () => 'baz')         // fallback      _ = [1, 'bar']
 *     (end);
 *
 *     > 'bar'
 * ```
 */
function when(value: any): any {
  return _when(value);
}

export { when, _, end };
