/* eslint-disable no-unused-expressions */
/* eslint-disable indent */
/* eslint-disable func-call-spacing */
/* eslint-disable no-spaced-func */
/* eslint-disable no-unexpected-multiline */

import { expect } from 'chai';

import { cond, then, end } from '../src';

describe('the when function: base cases', () => {
  it('should match the first matching value (1)', () => {
    const fizzBuzz = (number) => cond
      (number % 15 === 0, then('fizzbuzz'))
      (number % 3 === 0, then('fizz'))
      (number % 5 === 0, then('buzz'))
      (true, then(number))
    (end);

    const result = [1, 2, 3, 4, 5, 7, 15, 16].map(fizzBuzz);
    expect(result).to.deep.equal([1, 2, 'fizz', 4, 'buzz', 7, 'fizzbuzz', 16]);
  });
});
