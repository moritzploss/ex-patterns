import { curry } from 'ramda';

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

    if (arguments.length === 1) {
      return curry(_cond)(value);
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
 * @example
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
const cond = curry(
  (value: any, returnValue: any) => _cond()(value, returnValue),
);

export { cond };
