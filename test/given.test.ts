/* eslint-disable no-unused-vars */
/* eslint-disable no-unused-expressions */
/* eslint-disable indent */
/* eslint-disable func-call-spacing */
/* eslint-disable no-spaced-func */
/* eslint-disable no-unexpected-multiline */
/* eslint-disable arrow-parens */

import { expect } from 'chai';

import { given, then, end, unless, _, A, B, C, D, E, F, G, V } from '../src';

describe('the given function: base cases', () => {
  it('should match the first matching value (1)', () => {

    const result = given
      (A, () => 1)
      (B, ({ A }) => A + 1)
      (C, ({ B }) => B + 1)
      (3, ({ C }) => C)
    (then)
      (({ A, B, C }) => [A, B, C])
    (unless)
      (4, () => 4)
      (5, () => 5)
      (6, () => 6)
    (end);

    expect(result).to.deep.equal([1, 2, 3]);
  });
});
