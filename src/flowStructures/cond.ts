import { end, End } from '../symbols';

const _cond = (done = false, result = null) => (
  // eslint-disable-next-line func-names
  function (value: any | End, returnValue?: any): any {
    if (value === end) {
      if (done) {
        return result;
      }
      throw Error('No matching clause found. ');
    }

    if (arguments.length !== 2) {
      throw Error('Expected 1 or 2 arguments of type (end) or (pattern, function).');
    }

    if (done) {
      return _cond(true, result);
    }

    if (value) {
      return _cond(true, returnValue);
    }

    return _cond();
  }
);

/**
 * A compact switch statement that accepts any number of clauses in the format
 * (truthy?, value). Returns the `value` that corresponds to the first case
 * that `isTruthy`.
 *
 * @param isTruthy: A value that will be checked for truthyness
 * @param value: The value to return if `isTruthy` evaluates to truthy
 *
 * @returns `value`
 *
 * ## Examples
 * ```
      import { cond, end, then } from 'ex-patterns';

        const fizzBuzz = (number) => cond
            (number % 15 === 0, then('fizzbuzz'))
            (number % 3 === 0, then('fizz'))
            (number % 5 === 0, then('buzz'))
            (true, then(number))
        (end);

        fizzBuzz(5)
        > 'buzz'
 * ```
 */
function cond(value: any, returnValue: any) {
  return _cond()(value, returnValue);
}

export { cond };
