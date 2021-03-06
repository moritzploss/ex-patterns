/* eslint-disable no-unused-vars */
/* eslint-disable no-unused-expressions */

import { expect } from 'chai';
import { List } from 'immutable';

import { match, _, A, B } from '../../src';

describe('the match function: arrays', () => {
  it('should match two arrays if they are equal', () => {
    const [status, matches] = match([1], [1]);
    expect(status).to.be.true;
    expect(matches).to.deep.equal({});
  });

  it('should not match array and map', () => {
    const [status, matches] = match([1], { 0: 1 });
    expect(status).to.be.false;
    expect(matches).to.deep.equal({});
  });

  it('should not match two arrays if they are not equal', () => {
    const [status, matches] = match([1], [2]);
    expect(status).to.be.false;
    expect(matches).to.deep.equal({});
  });

  it('should not match two arrays if pattern is longer than value', () => {
    const [status, matches] = match([1, 2, 3], [2]);
    expect(status).to.be.false;
    expect(matches).to.deep.equal({});
  });

  it('should match on single placeholder in array', () => {
    const [status, matches] = match([1, _, 3, 4], [1, 2, 3, 4]);
    expect(status).to.be.true;
    expect(matches).to.deep.equal({});
  });

  it('should match on multiple placeholders in array', () => {
    const [status, matches] = match([1, _, 3, _, 5], [1, 2, 3, 4, 5]);
    expect(status).to.be.true;
    expect(matches).to.deep.equal({});
  });

  it('should not match if the pattern array is longer than the value (1)', () => {
    const [status, matches] = match([1, _], [1]);
    expect(status).to.be.false;
    expect(matches).to.deep.equal({});
  });

  it('should not match if the pattern array is longer than the value (2)', () => {
    const [status, matches] = match([1, 2], [1]);
    expect(status).to.be.false;
    expect(matches).to.deep.equal({});
  });

  it('should not match if array elements are in the wrong order', () => {
    const [status, matches] = match([2, 1], [1, 2]);
    expect(status).to.be.false;
    expect(matches).to.deep.equal({});
  });

  it('should not match if array elements are in the wrong order, even with placeholder', () => {
    const [status, matches] = match([_, 1], [1, 2]);
    expect(status).to.be.false;
    expect(matches).to.deep.equal({});
  });

  it('should match nested arrays (1)', () => {
    const [status] = match([1, [2, 3]], [1, [2, 3]]);
    expect(status).to.be.true;
  });

  it('should match nested arrays (2)', () => {
    const [status] = match([[2, 3], 1], [[2, 3], 1]);
    expect(status).to.be.true;
  });

  it('should match nested arrays with placeholders (1)', () => {
    const [status, matches] = match([[2, 3], _], [[2, 3], 1]);
    expect(status).to.be.true;
    expect(matches).to.deep.equal({});
  });

  it('should match nested arrays with placeholders (2)', () => {
    const [status, matches] = match([_, 1], [[2, 3], 1]);
    expect(status).to.be.true;
    expect(matches).to.deep.equal({});
  });

  it('should match nested arrays with placeholders (3)', () => {
    const [status, matches] = match([_, _], [[2, 3], 1]);
    expect(status).to.be.true;
    expect(matches).to.deep.equal({});
  });

  it('should match nested arrays with placeholders (4)', () => {
    const [status, matches] = match(_, [[2, 3], 1]);
    expect(status).to.be.true;
    expect(matches).to.deep.equal({});
  });

  it('should match nested arrays with placeholders (5)', () => {
    const [status, matches] = match([A, B], [[2, 3], 1]);
    expect(status).to.be.true;
    expect(matches).to.deep.equal({ A: [2, 3], B: 1 });
  });
});
