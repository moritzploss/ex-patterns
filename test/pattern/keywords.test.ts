/* eslint-disable no-unused-vars */
/* eslint-disable no-unused-expressions */
/* eslint-disable indent */
/* eslint-disable func-call-spacing */
/* eslint-disable no-spaced-func */
/* eslint-disable arrow-parens */

import { expect } from 'chai';
import { List, is } from 'immutable';

import { match, _, A, B, C, D, tail, head } from '../../src';

describe('the tail keyword: arrays', () => {
  it('should match on the last elements of an array (1)', () => {
    const [status, matches] = match([1, 2, tail], [1, 2, 3]);
    expect(status).to.be.true;
    expect(matches).to.deep.equal({});
  });

  it('should match on the last elements of an array (2)', () => {
    const [status, matches] = match([1, 2, tail], [1, 2, 3, 'foo']);
    expect(status).to.be.true;
    expect(matches).to.deep.equal({});
  });

  it('should match on the last elements of an array even if there are none', () => {
    const [status, matches] = match([1, 2, tail], [1, 2]);
    expect(status).to.be.true;
    expect(matches).to.deep.equal({});
  });

  it('should match on the first elements of an array if called as function (1)', () => {
    const [status, matches] = match([1, 2, tail()], [1, 2, 3]);
    expect(status).to.be.true;
    expect(matches).to.deep.equal({});
  });

  it('should capture the tail of an array if placeholder is provided (1)', () => {
    const [status, matches] = match([1, 2, tail(A)], [1, 2, 3]);
    expect(status).to.be.true;
    expect(matches).to.deep.equal({ A: [3] });
  });

  it('should capture the tail of an array if placeholder is provided (2)', () => {
    const [status, matches] = match([1, 2, tail(B)], [1, 2, 3, 'foo']);
    expect(status).to.be.true;
    expect(matches).to.deep.equal({ B: [3, 'foo'] });
  });

  it('should capture the tail of an array if placeholder is provided (3)', () => {
    const [status, matches] = match([1, 2, tail(C)], [1, 2]);
    expect(status).to.be.true;
    expect(matches).to.deep.equal({ C: [] });
  });

  it('should only be usable once per array', () => {
    const matchFunction = () => match([1, 2, tail(C), tail(D)], [1, 2, 3, 4]);
    expect(matchFunction).to.throw(Error);
  });

  it('should only be usable at the beginning of an array', () => {
    const matchFunction = () => match([1, tail, 3, 4], [1, 2, 3, 4]);
    expect(matchFunction).to.throw(Error);
  });

  it('should be usable several times in a pattern as long as it\'s not in the same array', () => {
    const [status, matches] = match([[[tail], tail(B)], 2, tail(C)], [[[1], 2], 2, 3]);
    expect(status).to.be.true;
    expect(matches).to.deep.equal({ C: [3], B: [2] });
  });

  it('should match against empty array', () => {
    const [status, matches] = match([tail], []);
    expect(status).to.be.true;
    expect(matches).to.deep.equal({});
  });

  it('should not match if two captured tails have different values', () => {
    const [status, matches] = match([[1, 2, tail(A)], tail(A)], [[1, 2, 3], 4]);
    expect(status).to.be.false;
    expect(matches).to.deep.equal({});
  });

  it('should match if two captured tails have the same value', () => {
    const [status, matches] = match([[1, 2, tail(A)], tail(A)], [[1, 2, 3], 3]);
    expect(status).to.be.true;
    expect(matches).to.deep.equal({ A: [3] });
  });

  it('should match if captured tail has same value as uncaptured tail', () => {
    const [status, matches] = match([[1, 2, tail(A)], tail], [[1, 2, 3], 3]);
    expect(status).to.be.true;
    expect(matches).to.deep.equal({ A: [3] });
  });
});

describe('the head keyword: arrays', () => {
  it('should match on the first elements of an array (1)', () => {
    const [status, matches] = match([head, 2, 3], [1, 2, 3]);
    expect(status).to.be.true;
    expect(matches).to.deep.equal({});
  });

  it('should match on the first elements of an array (2)', () => {
    const [status, matches] = match([head, 3, 'foo'], [1, 2, 3, 'foo']);
    expect(status).to.be.true;
    expect(matches).to.deep.equal({});
  });

  it('should match on the first elements of an array even if there are none', () => {
    const [status, matches] = match([head, 1, 2], [1, 2]);
    expect(status).to.be.true;
    expect(matches).to.deep.equal({});
  });

  it('should match on the first elements of an array if called as function (1)', () => {
    const [status, matches] = match([head(), 2, 3], [1, 2, 3]);
    expect(status).to.be.true;
    expect(matches).to.deep.equal({});
  });

  it('should capture the head of an array if placeholder is provided (1)', () => {
    const [status, matches] = match([head(A), 2, 3], [1, 2, 3]);
    expect(status).to.be.true;
    expect(matches).to.deep.equal({ A: [1] });
  });

  it('should capture the head of an array if placeholder is provided (2)', () => {
    const [status, matches] = match([head(B), 3, 'foo'], [1, 2, 3, 'foo']);
    expect(status).to.be.true;
    expect(matches).to.deep.equal({ B: [1, 2] });
  });

  it('should capture the head of an array if placeholder is provided (3)', () => {
    const [status, matches] = match([head(C), 1, 2], [1, 2]);
    expect(status).to.be.true;
    expect(matches).to.deep.equal({ C: [] });
  });

  it('should only be usable once per array', () => {
    const matchFunction = () => match([head(A), head(B), 3, 4], [1, 2, 3, 4]);
    expect(matchFunction).to.throw(Error);
  });

  it('should only be usable at the beginning of an array', () => {
    const matchFunction = () => match([1, head, 3, 4], [1, 2, 3, 4]);
    expect(matchFunction).to.throw(Error);
  });

  it('should be usable several times in a pattern as long as it\'s not in the same array', () => {
    const [status, matches] = match([head(C), [head(B), [head]], 2, 3], [3, [2, [1]], 2, 3]);
    expect(status).to.be.true;
    expect(matches).to.deep.equal({ C: [3], B: [2] });
  });

  it('should match against empty array', () => {
    const [status, matches] = match([head], []);
    expect(status).to.be.true;
    expect(matches).to.deep.equal({});
  });

  it('should not match if two captured heads have different values', () => {
    const [status, matches] = match([head(A), [head(A), 2, 3]], [0, [1, 2, 3]]);
    expect(status).to.be.false;
    expect(matches).to.deep.equal({});
  });

  it('should match if two captured heads have the same value', () => {
    const [status, matches] = match([head(A), [head(A), 2, 3]], [0, [0, 2, 3]]);
    expect(status).to.be.true;
    expect(matches).to.deep.equal({ A: [0] });
  });

  it('should match if captured head has same value as uncaptured head', () => {
    const [status, matches] = match([head(A), [head, 2, 3]], [0, [0, 2, 3]]);
    expect(status).to.be.true;
    expect(matches).to.deep.equal({ A: [0] });
  });
});

describe('the tail keyword: Lists', () => {
  it('should match on the last elements of an array (1)', () => {
    const [status, matches] = match([1, 2, tail], List([1, 2, 3]));
    expect(status).to.be.true;
    expect(matches).to.deep.equal({});
  });

  it('should match on the last elements of an array (2)', () => {
    const [status, matches] = match([1, 2, tail], List([1, 2, 3, 'foo']));
    expect(status).to.be.true;
    expect(matches).to.deep.equal({});
  });

  it('should match on the last elements of an array even if there are none', () => {
    const [status, matches] = match([1, 2, tail], List([1, 2]));
    expect(status).to.be.true;
    expect(matches).to.deep.equal({});
  });

  it('should match on the first elements of an array if called as function (1)', () => {
    const [status, matches] = match([1, 2, tail()], List([1, 2, 3]));
    expect(status).to.be.true;
    expect(matches).to.deep.equal({});
  });

  it('should capture the tail of an array if placeholder is provided (1)', () => {
    const [status, matches] = match([1, 2, tail(A)], List([1, 2, 3]));
    expect(status).to.be.true;
    expect(is(matches.A, List([3]))).to.be.true;
  });

  it('should capture the tail of an array if placeholder is provided (2)', () => {
    const [status, matches] = match([1, 2, tail(B)], List([1, 2, 3, 'foo']));
    expect(status).to.be.true;
    expect(is(matches.B, List([3, 'foo']))).to.be.true;
  });

  it('should capture the tail of an array if placeholder is provided (3)', () => {
    const [status, matches] = match([1, 2, tail(C)], List([1, 2]));
    expect(status).to.be.true;
    expect(is(matches.C, List([]))).to.be.true;
  });

  it('should only be usable once per array', () => {
    const matchFunction = () => match([1, 2, tail(C), tail(D)], List([1, 2, 3, 4]));
    expect(matchFunction).to.throw(Error);
  });

  it('should only be usable at the beginning of an array', () => {
    const matchFunction = () => match([1, tail, 3, 4], List([1, 2, 3, 4]));
    expect(matchFunction).to.throw(Error);
  });

  it('should be usable several times in a pattern as long as it\'s not in the same array', () => {
    const [status, matches] = match([[[tail], tail(B)], 2, tail(C)], List([List([List([1]), 2]), 2, 3]));
    expect(status).to.be.true;
    expect(is(matches.B, List([2]))).to.be.true;
    expect(is(matches.C, List([3]))).to.be.true;
  });

  it('should match against empty array', () => {
    const [status, matches] = match([tail], List([]));
    expect(status).to.be.true;
    expect(matches).to.deep.equal({});
  });
});

describe('the head keyword: Lists', () => {
  it('should match on the first elements of an array (1)', () => {
    const [status, matches] = match([head, 2, 3], List([1, 2, 3]));
    expect(status).to.be.true;
    expect(matches).to.deep.equal({});
  });

  it('should match on the first elements of an array (2)', () => {
    const [status, matches] = match([head, 3, 'foo'], List([1, 2, 3, 'foo']));
    expect(status).to.be.true;
    expect(matches).to.deep.equal({});
  });

  it('should match on the first elements of an array even if there are none', () => {
    const [status, matches] = match([head, 1, 2], List([1, 2]));
    expect(status).to.be.true;
    expect(matches).to.deep.equal({});
  });

  it('should match on the first elements of an array if called as function (1)', () => {
    const [status, matches] = match([head(), 2, 3], List([1, 2, 3]));
    expect(status).to.be.true;
    expect(matches).to.deep.equal({});
  });

  it('should capture the head of an array if placeholder is provided (1)', () => {
    const [status, matches] = match([head(A), 2, 3], List([1, 2, 3]));
    expect(status).to.be.true;
    expect(is(matches.A, List([1]))).to.be.true;
  });

  it('should capture the head of an array if placeholder is provided (2)', () => {
    const [status, matches] = match([head(B), 3, 'foo'], List([1, 2, 3, 'foo']));
    expect(status).to.be.true;
    expect(is(matches.B, List([1, 2]))).to.be.true;
  });

  it('should capture the head of an array if placeholder is provided (3)', () => {
    const [status, matches] = match([head(C), 1, 2], List([1, 2]));
    expect(status).to.be.true;
    expect(is(matches.C, List([]))).to.be.true;
  });

  it('should only be usable once per array', () => {
    const matchFunction = () => match([head(A), head(B), 3, 4], List([1, 2, 3, 4]));
    expect(matchFunction).to.throw(Error);
  });

  it('should only be usable at the beginning of an array', () => {
    const matchFunction = () => match([1, head, 3, 4], List([1, 2, 3, 4]));
    expect(matchFunction).to.throw(Error);
  });

  it('should be usable several times in a pattern as long as it\'s not in the same array', () => {
    const [status, matches] = match([head(C), [head(B), [head]], 2, 3], List([3, List([2, List([1])]), 2, 3]));
    expect(status).to.be.true;
    expect(is(matches.B, List([2]))).to.be.true;
    expect(is(matches.C, List([3]))).to.be.true;
  });

  it('should match against empty array', () => {
    const [status, matches] = match([head], List([]));
    expect(status).to.be.true;
    expect(matches).to.deep.equal({});
  });
});

describe('combining head and tail keyword: arrays', () => {
  it('should throw if \'head\' and \'tail\'', () => {
    const matchFunc = () => match([head, 2, 3, 4, tail], [1, 2, 3, 4, 5]);
    expect(matchFunc).to.throw(Error);
  });

  it('should throw if head is bound to invalid placeholder', () => {
    const invalidPlaceholder = { name: 'foo', symbol: Symbol('foo') };
    const matchFunc = () => match([head(invalidPlaceholder), 2, 3, 4, 5], [1, 2, 3, 4, 5]);
    expect(matchFunc).to.throw(Error);
  });

  it('should throw if tail is bound to invalid placeholder', () => {
    const invalidPlaceholder = { name: 'foo', symbol: Symbol('foo') };
    const matchFunc = () => match([1, 2, 3, 4, tail(invalidPlaceholder)], [1, 2, 3, 4, 5]);
    expect(matchFunc).to.throw(Error);
  });
});

describe('the tail keyword: match conflicts', () => {
  it('should not match in case of match conflicts with named placeholders', () => {
    const [status, matches] = match([A, 2, tail(A)], [1, 2, 3]);
    expect(status).to.be.false;
    expect(matches).to.deep.equal({});
  });
});

describe('the tail keyword: match conflicts', () => {
  it('should not match in case of match conflicts with named placeholders', () => {
    const [status, matches] = match([head(A), 2, A], [1, 2, 3]);
    expect(status).to.be.false;
    expect(matches).to.deep.equal({});
  });
});
