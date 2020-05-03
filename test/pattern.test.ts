/* eslint-disable no-unused-vars */
/* eslint-disable no-unused-expressions */
/* eslint-disable indent */
/* eslint-disable func-call-spacing */
/* eslint-disable no-spaced-func */
/* eslint-disable arrow-parens */

import { expect } from 'chai';
import { Map, List } from 'immutable';

import { match, _, A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y, Z } from '../src';

describe('the match function: primitives', () => {
  it('should match two numbers if they are equal', () => {
    const [status, matches] = match(1, 1);
    expect(status).to.be.true;
  });

  it('should not match two numbers if they are not equal', () => {
    const [status, matches] = match(1, 2);
    expect(status).to.be.false;
  });

  it('should match a placeholder with a number', () => {
    const [status, matches] = match(_, 2);
    expect(status).to.be.true;
  });

  it('should match two strings if they are equal', () => {
    const [status, matches] = match('hello', 'hello');
    expect(status).to.be.true;
  });

  it('should not match two strings if they are not equal', () => {
    const [status, matches] = match('hello', 'world');
    expect(status).to.be.false;
  });

  it('should match a placeholder with a string', () => {
    const [status, matches] = match(_, 'hello');
    expect(status).to.be.true;
  });

  it('should match on null', () => {
    const [status, matches] = match(null, null);
    expect(status).to.be.true;
  });

  it('should match a placeholder with null', () => {
    const [status, matches] = match(_, null);
    expect(status).to.be.true;
  });

  it('should match on undefined', () => {
    const [status, matches] = match(undefined, undefined);
    expect(status).to.be.true;
  });

  it('should not match null and undefined', () => {
    let [status, matches] = match(null, undefined);
    expect(status).to.be.false;

    [status, matches] = match(null, undefined);
    expect(status).to.be.false;
  });

  it('should match a placeholder with null', () => {
    const [status, matches] = match(_, undefined);
    expect(status).to.be.true;
  });

  it('should match two BigInts if they are equal', () => {
    const [status, matches] = match(BigInt(1), BigInt(1));
    expect(status).to.be.true;
  });

  it('should not match two BigInts if they are not equal', () => {
    const [status, matches] = match(BigInt(1), BigInt(2));
    expect(status).to.be.false;
  });

  it('should match a placeholder with a BigInt', () => {
    const [status, matches] = match(_, BigInt(1));
    expect(status).to.be.true;
  });
});

describe('the match function: arrays', () => {
  it('should match two arrays if they are equal', () => {
    const [status, matches] = match([1], [1]);
    expect(status).to.be.true;
  });

  it('should not match two arrays if they are not equal', () => {
    const [status, matches] = match([1], [2]);
    expect(status).to.be.false;
  });

  it('should match on single placeholder in array', () => {
    const [status, matches] = match([1, _, 3, 4], [1, 2, 3, 4]);
    expect(status).to.be.true;
  });

  it('should match on multiple placeholders in array', () => {
    const [status, matches] = match([1, _, 3, _, 5], [1, 2, 3, 4, 5]);
    expect(status).to.be.true;
  });

  it('should not match if the pattern array is longer than the expression (1)', () => {
    const [status, matches] = match([1, _], [1]);
    expect(status).to.be.false;
  });

  it('should not match if the pattern array is longer than the expression (2)', () => {
    const [status, matches] = match([1, 2], [1]);
    expect(status).to.be.false;
  });

  it('should not match if array elements are in the wrong order', () => {
    const [status, matches] = match([2, 1], [1, 2]);
    expect(status).to.be.false;
  });

  it('should not match if array elements are in the wrong order, even with placeholder', () => {
    const [status, matches] = match([_, 1], [1, 2]);
    expect(status).to.be.false;
  });

  it('should match nested arrays (1)', () => {
    const [status, matches] = match([1, [2, 3]], [1, [2, 3]]);
    expect(status).to.be.true;
  });

  it('should match nested arrays (2)', () => {
    const [status, matches] = match([[2, 3], 1], [[2, 3], 1]);
    expect(status).to.be.true;
  });

  it('should match nested arrays with placeholders (1)', () => {
    const [status, matches] = match([[2, 3], _], [[2, 3], 1]);
    expect(status).to.be.true;
  });

  it('should match nested arrays with placeholders (2)', () => {
    const [status, matches] = match([_, 1], [[2, 3], 1]);
    expect(status).to.be.true;
  });

  it('should match nested arrays with placeholders (3)', () => {
    const [status, matches] = match([_, _], [[2, 3], 1]);
    expect(status).to.be.true;
  });
});

describe('the match function: Immutable.js Lists', () => {
  it('should match an array against a List if they have same elements', () => {
    const [status, matches] = match([1, 2], List([1, 2]));
    expect(status).to.be.true;
  });

  it('should work with List as pattern', () => {
    const [status, matches] = match(List([1]), List([1]));
    expect(status).to.be.true;
  });

  it('should not match an array against a List if they don\'t have same elements', () => {
    const [status, matches] = match([1], List([2]));
    expect(status).to.be.false;
  });

  it('should match on single placeholder in array', () => {
    const [status, matches] = match([1, _, 3, 4], List([1, 2, 3, 4]));
    expect(status).to.be.true;
  });

  it('should match on multiple placeholders in array', () => {
    const [status, matches] = match([1, _, 3, _, 5], List([1, 2, 3, 4, 5]));
    expect(status).to.be.true;
  });

  it('should not match if the pattern array is longer than the value (1)', () => {
    const [status, matches] = match([1, _], List([1]));
    expect(status).to.be.false;
  });

  it('should not match if the pattern array is longer than the value (2)', () => {
    const [status, matches] = match([1, 2], List([1]));
    expect(status).to.be.false;
  });

  it('should not match if pattern elements are in the wrong order', () => {
    const [status, matches] = match([2, 1], List([1, 2]));
    expect(status).to.be.false;
  });

  it('should not match if pattern elements are in the wrong order, even with placeholder', () => {
    const [status, matches] = match([_, 1], List([1, 2]));
    expect(status).to.be.false;
  });

  it('should match nested Lists (1)', () => {
    const [status, matches] = match([1, [2, 3]], List([1, List([2, 3])]));
    expect(status).to.be.true;
  });

  it('should match nested Lists (2)', () => {
    const [status, matches] = match([[2, 3], 1], List([List([2, 3]), 1]));
    expect(status).to.be.true;
  });

  it('should match nested Lists with placeholders (1)', () => {
    const [status, matches] = match([[2, 3], _], List([List([2, 3]), 1]));
    expect(status).to.be.true;
  });

  it('should match nested Lists with placeholders (2)', () => {
    const [status, matches] = match([_, 1], List([List([2, 3]), 1]));
    expect(status).to.be.true;
  });

  it('should match nested Lists with placeholders (3)', () => {
    const [status, matches] = match([_, _], List([List([2, 3]), 1]));
    expect(status).to.be.true;
  });
});

describe('the match function: objects', () => {
  it('should match two objects if they are equal', () => {
    const [status, matches] = match({ a: 1 }, { a: 1 });
    expect(status).to.be.true;
  });

  it('should not match two objects if they are not equal', () => {
    const [status, matches] = match({ b: 1 }, { a: 1 });
    expect(status).to.be.false;
  });

  it('should match empty object against any object', () => {
    const [status, matches] = match({}, { a: 1 });
    expect(status).to.be.true;
  });

  it('should match two objects if left hand side is subset of righthand side', () => {
    const [status, matches] = match({ a: 1 }, { a: 1, b: 2 });
    expect(status).to.be.true;
  });

  it('should match on placeholders as object values', () => {
    const [status, matches] = match({ a: _ }, { a: 1 });
    expect(status).to.be.true;
  });

  it('should match on placeholders as object values for objects with multiple keys', () => {
    const [status, matches] = match({ a: _, b: 3 }, { a: 1, b: 3 });
    expect(status).to.be.true;
  });

  it('should match on nested objects', () => {
    const [status, matches] = match({ a: { c: 1 }, b: 3 }, { a: { c: 1 }, b: 3 });
    expect(status).to.be.true;
  });

  it('should match on nested objects with placeholders (1)', () => {
    const [status, matches] = match({ a: { c: _ }, b: 3 }, { a: { c: 1 }, b: 3 });
    expect(status).to.be.true;
  });

  it('should match on nested objects with placeholders (2)', () => {
    const [status, matches] = match({ a: _, b: 3 }, { a: { c: 1 }, b: 3 });
    expect(status).to.be.true;
  });
});

describe('the match function: Immutable.js Maps', () => {
  it('should match object and Map if they have same properties', () => {
    const [status, matches] = match({ a: 1 }, Map({ a: 1 }));
    expect(status).to.be.true;
  });

  it('should work with Map as pattern', () => {
    const [status, matches] = match(Map({ a: 1 }), Map({ a: 1 }));
    expect(status).to.be.true;
  });

  it('should not match object and Map if they don\'t have same properties', () => {
    const [status, matches] = match({ b: 1 }, Map({ a: 1 }));
    expect(status).to.be.false;
  });

  it('should match empty object against any Map', () => {
    const [status, matches] = match({}, Map({ a: 1 }));
    expect(status).to.be.true;
  });

  it('should match two objects if left hand side is subset of righthand side', () => {
    const [status, matches] = match({ a: 1 }, Map({ a: 1, b: 2 }));
    expect(status).to.be.true;
  });

  it('should match on placeholders as object values', () => {
    const [status, matches] = match({ a: _ }, Map({ a: 1 }));
    expect(status).to.be.true;
  });

  it('should match on placeholders as object values for objects with multiple keys', () => {
    const [status, matches] = match({ a: _, b: 3 }, Map({ a: 1, b: 3 }));
    expect(status).to.be.true;
  });

  it('should match on nested objects', () => {
    const [status, matches] = match({ a: { c: 1 }, b: 3 }, Map({ a: Map({ c: 1 }), b: 3 }));
    expect(status).to.be.true;
  });

  it('should match on nested objects with placeholders (1)', () => {
    const [status, matches] = match({ a: { c: _ }, b: 3 }, Map({ a: Map({ c: 1 }), b: 3 }));
    expect(status).to.be.true;
  });

  it('should match on nested objects with placeholders (2)', () => {
    const [status, matches] = match({ a: _, b: 3 }, Map({ a: Map({ c: 1 }), b: 3 }));
    expect(status).to.be.true;
  });

  it('should match on nested objects with placeholders (2)', () => {
    const pattern = { foo: { bar: A } };
    const value = Map({ foo: Map({ bar: 'hello' }), baz: 'world' });
    const [status, matches] = match(pattern, value);

    expect(status).to.be.true;
  });

  it('should based on value equality if pattern is Map', () => {
    const pattern = Map({ bar: 'hello' });
    const value = { bar: 'hello' };
    const [status, matches] = match(pattern, value);

    expect(status).to.be.false;
  });
});

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
