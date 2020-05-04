/* eslint-disable no-unused-vars */
/* eslint-disable no-unused-expressions */
/* eslint-disable indent */
/* eslint-disable func-call-spacing */
/* eslint-disable no-spaced-func */
/* eslint-disable arrow-parens */

import { expect } from 'chai';
import { Map, List } from 'immutable';

import { match, _, A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y, Z, tail, head } from '../../src';

describe('the match function: regular expressions', () => {
  it('should not match regular expressions on strings', () => {
    const [status, matches] = match(/hello/, 'hello');
    expect(status).to.be.false;
  });

  it('should match regular expressions on regular expressions', () => {
    const [status, matches] = match(/abc/, /abc/);
    expect(status).to.be.true;
  });
});

describe('the match function: functions', () => {
  it('should not match anonymous functions', () => {
    const [status, matches] = match((foo) => foo, (foo) => foo);
    expect(status).to.be.false;
  });

  it('should named functions to themselves', () => {
    function a(foo) { return false; }
    const [status, matches] = match(a, a);
    expect(status).to.be.true;
  });

  it('should not match named functions to other named functions', () => {
    function a(foo) { return false; }
    function b(foo) { return false; }
    const [status, matches] = match(a, b);
    expect(status).to.be.false;
  });
});

describe('the match function: matches', () => {
  it('should return an empty object for successful unnamed matches', () => {
    const [status, matches] = match([1, _, 3], [1, 2, 3]);
    expect(matches).to.deep.equal({});
  });

  it('should return an empty object for unsuccesful unnamed matches', () => {
    const [status, matches] = match([1, 4, 3], [1, 2, 3]);
    expect(matches).to.deep.equal({});
  });

  it('should return an empty object for unsuccesful named matches', () => {
    const [status, matches] = match([1, 4, A], [1, 2, 3]);
    expect(matches).to.deep.equal({});
  });

  it('should return an object with named matches for succesful named matches (numbers)', () => {
    const [isMatch, matches] = match(A, 1);
    expect(isMatch).to.be.true;
    expect(matches).to.deep.equal({ A: 1 });
  });

  it('should return an object with named matches for succesful named matches (strings)', () => {
    const [isMatch, matches] = match({ a: A }, { a: 'hello' });
    expect(isMatch).to.be.true;
    expect(matches).to.deep.equal({ A: 'hello' });
  });

  it('should return an object with named matches for succesful named matches (symbols)', () => {
    const aSymbol = Symbol('hello');
    const [isMatch, matches] = match({ a: A }, { a: aSymbol });
    expect(isMatch).to.be.true;
    expect(matches).to.deep.equal({ A: aSymbol });
  });

  it('should return an object with named matches for succesful named matches (bigInts)', () => {
    const aBigInt = BigInt('1');
    const [isMatch, matches] = match({ a: A }, { a: aBigInt });
    expect(isMatch).to.be.true;
    expect(matches).to.deep.equal({ A: aBigInt });
  });

  it('should return an object with named matches for succesful named matches (null)', () => {
    const [isMatch, matches] = match({ a: A }, { a: null });
    expect(isMatch).to.be.true;
    expect(matches).to.deep.equal({ A: null });
  });

  it('should return an object with named matches for succesful named matches (undefined)', () => {
    const [isMatch, matches] = match({ a: A }, { a: undefined });
    expect(isMatch).to.be.true;
    expect(matches).to.deep.equal({ A: undefined });
  });

  it('should return an object with named matches for succesful named matches (arrays)', () => {
    const [isMatch, matches] = match([A], [1]);
    expect(isMatch).to.be.true;
    expect(matches).to.deep.equal({ A: 1 });
  });

  it('should return an object with named matches for succesful named matches (objects)', () => {
    const [isMatch, matches] = match({ a: A }, { a: 1 });
    expect(isMatch).to.be.true;
    expect(matches).to.deep.equal({ A: 1 });
  });

  it('should return an object with named matches for succesful named matches (Maps)', () => {
    const [isMatch, matches] = match({ a: A }, Map({ a: 1 }));
    expect(isMatch).to.be.true;
    expect(matches).to.deep.equal({ A: 1 });
  });

  it('should return an object with named matches for succesful named matches (Lists)', () => {
    const [isMatch, matches] = match([A], List([1]));
    expect(isMatch).to.be.true;
    expect(matches).to.deep.equal({ A: 1 });
  });

  it('should return an object with named matches for several succesful named matches', () => {
    const [isMatch, matches] = match([1, A, B], [1, 2, 3]);
    expect(isMatch).to.be.true;
    expect(matches).to.deep.equal({ A: 2, B: 3 });
  });

  it('should return an empty object for partially successful named matches', () => {
    const [isMatch, matches] = match([1, A, B, 3], [1, 2, 3, 4]);
    expect(isMatch).to.be.false;
    expect(matches).to.deep.equal({});
  });

  it('should perform complex named matches', () => {
    const value = { foo: { bar: ['!', 2, { baz: 'world' }] }, bar: 'hello' };
    const pattern = { foo: { bar: [C, 2, { baz: B }] }, bar: A };

    const [isMatch, matches] = match(pattern, value);
    expect(isMatch).to.be.true;
    expect(matches).to.deep.equal({ A: 'hello', B: 'world', C: '!' });
  });

  it('should not include unnamed matches if named matches are present', () => {
    const [isMatch, matches] = match([1, A, _, 4], [1, 2, 3, 4]);
    expect(isMatch).to.be.true;
    expect(matches).to.deep.equal({ A: 2 });
  });

  it('should allow for named match to occur several times as long as value is equal', () => {
    const [isMatch, matches] = match([1, A, A, 4], [1, 2, 2, 4]);
    expect(isMatch).to.be.true;
    expect(matches).to.deep.equal({ A: 2 });
  });

  it('should not allow for named match to occur several times if value is not equal', () => {
    const [isMatch, matches] = match([1, A, A, 4], [1, 2, 3, 4]);
    expect(isMatch).to.be.false;
    expect(matches).to.deep.equal({});
  });
});

describe('the match function: all together now', () => {
  it('should match complex nested patterns', () => {
    // eslint-disable-next-line no-undef
    const pattern = { a: [1, _, _], b: { c: [null, BigInt('1'), [_, 'foo']] } };
    // eslint-disable-next-line no-multi-spaces, no-undef
    const value   = { a: [1, 2, undefined], b: { c: [null, BigInt('1'), ['baz', 'foo']] } };

    const [status, matches] = match(pattern, value);
    expect(status).to.be.true;
  });

  it('should correctly identify if complex patterns don\'t match', () => {
    // eslint-disable-next-line no-undef
    const pattern = { a: [1, _, _], b: { c: [undefined, BigInt('1'), [_, 'foo']] } };
    // eslint-disable-next-line no-multi-spaces, no-undef
    const value   = { a: [1, 2, undefined], b: { c: [null, BigInt('1'), ['baz', 'foo']] } };

    const [status, matches] = match(pattern, value);
    expect(status).to.be.false;
  });
});

describe('the match function: placeholders', () => {
  it('should correctly map named placeholders', () => {
    // eslint-disable-next-line no-multi-spaces, max-len
    const pattern = [A, B, C, D, E, F, G, H, I,  J,  K,  L,  M,  N,  O,  P,  Q,  R,  S,  T,  U,  V,  W,  X,  Y,  Z];
        // eslint-disable-next-line no-multi-spaces, max-len
    const value   = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26];

    const [status, matches] = match(pattern, value);
    expect(matches).to.deep.equal({
      A: 1,
      B: 2,
      C: 3,
      D: 4,
      E: 5,
      F: 6,
      G: 7,
      H: 8,
      I: 9,
      J: 10,
      K: 11,
      L: 12,
      M: 13,
      N: 14,
      O: 15,
      P: 16,
      Q: 17,
      R: 18,
      S: 19,
      T: 20,
      U: 21,
      V: 22,
      W: 23,
      X: 24,
      Y: 25,
      Z: 26,
    });
  });
});

describe('the match function: user errors', () => {
  it('should throw an error if right hand side of match includes a placeholder', () => {
    expect(() => match(1, _)).to.throw(Error);
  });

  it('should not throw an error if object keys are underscores', () => {
    expect(() => match({ _: 1 }, { a: 1 })).to.not.throw(Error);
  });
});
