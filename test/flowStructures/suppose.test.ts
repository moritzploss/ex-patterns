/* eslint-disable no-unused-vars */
/* eslint-disable no-unused-expressions */
/* eslint-disable indent */
/* eslint-disable func-call-spacing */
/* eslint-disable no-spaced-func */
/* eslint-disable no-unexpected-multiline */
/* eslint-disable arrow-parens */
/* eslint-disable operator-linebreak */


import { expect } from 'chai';

import { suppose, then, end, otherwise, _, A, B, C, D, E, F, G, V } from '../../src';

describe('the suppose function: base cases', () => {
  it('should execute the then clause if the suppose clause matches (1)', () => {
    const result =
      suppose
        (1, () => 1)
      (then)
        (() => 'success')
      (otherwise)
        (_, () => 'no success')
      (end);

    expect(result).to.deep.equal('success');
  });

  it('should execute the then clause if the suppose clause matches (2)', () => {
    const result =
      suppose
        (1, () => 1)
        (2, () => 2)
      (then)
        (() => 'success')
      (otherwise)
        (_, () => 'no success')
      (end);

    expect(result).to.deep.equal('success');
  });

  it('should execute the then clause if the suppose clause matches (3)', () => {
    const result =
      suppose
        (1, () => 1)
        (2, () => 2)
        (3, () => 3)
      (then)
        (() => 'success')
      (otherwise)
        (_, () => 'no success')
      (end);

    expect(result).to.deep.equal('success');
  });

  it('should pipe matches through the suppose clauses (1)', () => {
    const result =
      suppose
        (A, () => 1)
        (1, ({ A }) => A)
        (1, ({ A }) => A)
      (then)
        (() => 'success')
      (otherwise)
        (_, () => 'no success')
      (end);

    expect(result).to.deep.equal('success');
  });

  it('should pipe matches through the suppose clauses (2)', () => {
    const result =
      suppose
        (A, () => 1)
        (B, ({ A }) => A + 1)
        ([1, 2], ({ A, B }) => [A, B])
      (then)
        (() => 'success')
      (otherwise)
        (_, () => 'no success')
      (end);

    expect(result).to.deep.equal('success');
  });

  it('should pipe matches to the then clause', () => {
    const result =
      suppose
        (A, () => 1)
        (B, ({ A }) => A + 1)
        ([1, 2, C], ({ A, B }) => [A, B, 3])
      (then)
        (({ A, B, C }) => [A, B, C])
      (otherwise)
        (_, () => 'no success')
      (end);

    expect(result).to.deep.equal([1, 2, 3]);
  });

  it('should work with parent capturing', () => {
    const result =
      suppose
        (A({ name: 'foo' }), () => ({ name: 'foo', id: '123' }))
        (A, ({ A }) => A)
      (then)
        (({ A }) => A)
      (otherwise)
        (_, () => 'no success')
      (end);

    expect(result).to.deep.equal({ name: 'foo', id: '123' });
  });

  it('should catch if suppose clause does not match', () => {
    const result =
      suppose
        (2, () => 1)
      (then)
        (() => 'success')
      (otherwise)
        (_, () => 'no success')
      (end);

    expect(result).to.deep.equal('no success');
  });

  it('should pipe result of first non-matching suppose clause to otherwise clauses', () => {
    const result =
      suppose
        (2, () => 1)
      (then)
        (() => 'success')
      (otherwise)
        (1, () => 'got it!')
        (_, () => 'no success!')
      (end);

    expect(result).to.deep.equal('got it!');
  });

  it('should throw if second argument in suppose clause is not a function', () => {
    const func = () => (
        suppose
          (2, 'not a function')
        (then)
          (() => 'success')
        (otherwise)
          (1, () => 'got it!')
          (_, () => 'no success!')
        (end)
      );

    expect(func).to.throw(Error);
  });

  it('should throw if called with end prematurely', () => {
    const func = () => (
        suppose
          (2, () => 1)
        (end)
      );

    expect(func).to.throw(Error);
  });

  it('should throw if then clause is not a function', () => {
    const func = () => (
      suppose
        (2, () => 2)
      (then)
        ('not a function')
      (otherwise)
        (1, () => 'got it!')
        (_, () => 'no success!')
      (end)
    );

    expect(func).to.throw(Error);
  });
});
