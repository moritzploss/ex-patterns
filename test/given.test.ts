/* eslint-disable no-unused-vars */
/* eslint-disable no-unused-expressions */
/* eslint-disable indent */
/* eslint-disable func-call-spacing */
/* eslint-disable no-spaced-func */
/* eslint-disable no-unexpected-multiline */
/* eslint-disable arrow-parens */

import { expect } from 'chai';

import { when, then, end, _, A, B, C, D, E, F, G, V } from '../src';

describe('the when function: base cases', () => {
  it('should match the first matching value (1)', () => {
    given
      ([A, _], () => ['foo', 'bar'])
      ([_, C], ({ A }) => [A, 2])
      ([D, _], ({ A, C }) => ['baz', C])
    (then)
      (({ A, C, D }) => {
        const foo = 'foo';
        const bar = 'bar';
        const baz = 'baz';
        return [A, C, D, foo, bar, baz];
      })
    (unless)
      ([head], then(() => ['foo', 'bar']))
      ({}, then(() => ({ foo: 'bar' })))
    (end);

    expect(result).to.equal(1);
  });

});
