/* eslint-disable no-unused-vars */
/* eslint-disable no-unused-expressions */
/* eslint-disable indent */
/* eslint-disable func-call-spacing */
/* eslint-disable no-spaced-func */
/* eslint-disable arrow-parens */

import { expect } from 'chai';

import { match, _, A, B, C, D } from '../src';

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

  it('should not match two objects if left hand side is subset of righthand side', () => {
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
    const expression = { a: [1, 2, undefined], b: { c: [null, BigInt('1'), ['baz', 'foo']] } };
    const pattern = { a: [1, _, _], b: { c: [null, BigInt('1'), [_, 'foo']] } };

    const [status, matches] = match(pattern, expression);
    expect(status).to.be.true;
  });

  it('should correctly identify if complex patterns don\'t match', () => {
    const expression = { a: [1, 2, undefined], b: { c: [null, BigInt('1'), ['baz', 'foo']] } };
    const pattern = { a: [1, _, _], b: { c: [undefined, BigInt('1'), [_, 'foo']] } };

    const [status, matches] = match(pattern, expression);
    expect(status).to.be.false;
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
