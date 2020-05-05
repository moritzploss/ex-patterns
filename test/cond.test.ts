/* eslint-disable no-unused-expressions */
/* eslint-disable indent */
/* eslint-disable func-call-spacing */
/* eslint-disable no-spaced-func */
/* eslint-disable no-unexpected-multiline */

import { expect } from 'chai';

import { cond, then, end } from '../src';

describe('the when function: base cases', () => {
  it('should match the first matching value', () => {
    const fizzBuzz = (number) => cond
      (number % 15 === 0, then('fizzbuzz'))
      (number % 3 === 0, then('fizz'))
      (number % 5 === 0, then('buzz'))
      (true, then(number))
    (end);

    const result = [1, 2, 3, 4, 5, 7, 15, 16].map(fizzBuzz);
    expect(result).to.deep.equal([1, 2, 'fizz', 4, 'buzz', 7, 'fizzbuzz', 16]);
  });

  it('should throw if called with only one argument that is not \'end\'', () => {
    const fizzBuzz = (number) => cond
      (number % 15 === 0, then('fizzbuzz'))
      (number % 3 === 0, then('fizz'))
      (number % 5 === 0, then('buzz'))
      (true, then(number))
    ('end');

    const func = () => fizzBuzz(5);
    expect(func).to.throw(Error);
  });

  it('should throw if no matching clause is found', () => {
    const fizzBuzz = (number) => cond
      (number % 15 === 0, then('fizzbuzz'))
      (number % 3 === 0, then('fizz'))
      (number % 5 === 0, then('buzz'))
    (end);

    const func = () => fizzBuzz(1);
    expect(func).to.throw(Error);
  });

  it('should adhere to JavaScript\'s concept of falsiness', () => {
    const result = cond
      (false, then('no match'))
      (0, then('no match'))
      (-0, then('no match'))
      ('', then('no match'))
      (null, then('no match'))
      (undefined, then('no match'))
      (NaN, then('no match'))
      (1, then('this one matches'))
    (end);

    expect(result).to.deep.equal('this one matches');
  });

  it('should adhere to JavaScript\'s concept of truthiness', () => {
    const result = cond
      (!true, then('no match'))
      (!{}, then('no match'))
      (![], then('no match'))
      (!42, then('no match'))
      (!'0', then('no match'))
      (!'false', then('no match'))
      (!new Date(), then('no match'))
      (!-42, then('no match'))
      (!3.14, then('no match'))
      (!-3.14, then('no match'))
      (!Infinity, then('no match'))
      (!-Infinity, then('no match'))
      (true, then('this one matches'))
    (end);

    expect(result).to.deep.equal('this one matches');
  });
});
