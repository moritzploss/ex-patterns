/* eslint-disable no-unused-vars */
/* eslint-disable no-unused-expressions */
/* eslint-disable indent */
/* eslint-disable func-call-spacing */
/* eslint-disable no-spaced-func */
/* eslint-disable arrow-parens */

import { expect } from 'chai';
import { Map, is } from 'immutable';

import { match, _, A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y, Z, tail, head } from '../../src';

describe('the match function: objects', () => {
  it('should match two objects if they are equal', () => {
    const [status, matches] = match({ a: 1 }, { a: 1 });
    expect(status).to.be.true;
    expect(matches).to.deep.equal({});
  });

  it('should not match two objects if they are not equal', () => {
    const [status, matches] = match({ b: 1 }, { a: 1 });
    expect(status).to.be.false;
    expect(matches).to.deep.equal({});
  });

  it('should match empty object against any object', () => {
    const [status, matches] = match({}, { a: 1 });
    expect(status).to.be.true;
    expect(matches).to.deep.equal({});
  });

  it('should match two objects if left hand side is subset of righthand side', () => {
    const [status, matches] = match({ a: 1 }, { a: 1, b: 2 });
    expect(status).to.be.true;
    expect(matches).to.deep.equal({});
  });

  it('should match on named placeholders as object values', () => {
    const [status, matches] = match({ a: A }, { a: 1 });
    expect(status).to.be.true;
    expect(matches).to.deep.equal({ A: 1 });
  });

  it('should match on placeholders as object values for objects with multiple keys', () => {
    const [status, matches] = match({ a: B, b: 3 }, { a: 1, b: 3 });
    expect(status).to.be.true;
    expect(matches).to.deep.equal({ B: 1 });
  });

  it('should match on nested objects', () => {
    const [status, matches] = match({ a: { c: 1 }, b: 3 }, { a: { c: 1 }, b: 3 });
    expect(status).to.be.true;
    expect(matches).to.deep.equal({});
  });

  it('should match on nested objects with placeholders (1)', () => {
    const [status, matches] = match({ a: { c: A }, b: 3 }, { a: { c: 1 }, b: 3 });
    expect(status).to.be.true;
    expect(matches).to.deep.equal({ A: 1 });
  });

  it('should match on nested objects with placeholders (2)', () => {
    const [status, matches] = match({ a: C, b: 3 }, { a: { c: 1 }, b: 3 });
    expect(status).to.be.true;
    expect(matches).to.deep.equal({ C: { c: 1 } });
  });
});

describe('the match function: Immutable.js Maps', () => {
  it('should match object and Map if they have same properties', () => {
    const [status, matches] = match({ a: 1 }, Map({ a: 1 }));
    expect(status).to.be.true;
    expect(matches).to.deep.equal({});
  });

  it('should work with Map as pattern', () => {
    const [status, matches] = match(Map({ a: 1 }), Map({ a: 1 }));
    expect(status).to.be.true;
    expect(matches).to.deep.equal({});
  });

  it('should not match object and Map if they don\'t have same properties', () => {
    const [status, matches] = match({ b: 1 }, Map({ a: 1 }));
    expect(status).to.be.false;
    expect(matches).to.deep.equal({});
  });

  it('should match empty object against any Map', () => {
    const [status, matches] = match({}, Map({ a: 1 }));
    expect(status).to.be.true;
    expect(matches).to.deep.equal({});
  });

  it('should match two objects if left hand side is subset of righthand side', () => {
    const [status, matches] = match({ a: 1 }, Map({ a: 1, b: 2 }));
    expect(status).to.be.true;
    expect(matches).to.deep.equal({});
  });

  it('should match on placeholders as object values', () => {
    const [status, matches] = match({ a: A }, Map({ a: 1 }));
    expect(status).to.be.true;
    expect(matches).to.deep.equal({ A: 1 });
  });

  it('should match on placeholders as object values for objects with multiple keys', () => {
    const [status, matches] = match({ a: 1, b: B }, Map({ a: 1, b: 3 }));
    expect(status).to.be.true;
    expect(matches).to.deep.equal({ B: 3 });
  });

  it('should match on nested objects', () => {
    const [status, matches] = match({ a: { c: 1 }, b: 3 }, Map({ a: Map({ c: 1 }), b: 3 }));
    expect(status).to.be.true;
    expect(matches).to.deep.equal({});
  });

  it('should match on nested objects with placeholders (1)', () => {
    const [status, matches] = match({ a: { c: _ }, b: 3 }, Map({ a: Map({ c: 1 }), b: 3 }));
    expect(status).to.be.true;
    expect(matches).to.deep.equal({});
  });

  it('should match on nested objects with placeholders (2)', () => {
    const [status, matches] = match({ a: B, b: 3 }, Map({ a: Map({ c: 1 }), b: 3 }));
    expect(status).to.be.true;
    expect(is(matches.B, Map({ c: 1 }))).to.be.true;
  });

  it('should match on nested objects with placeholders (3)', () => {
    const [status, matches] = match({ a: B, b: 3 }, Map({ a: { c: 1 }, b: 3 }));
    expect(status).to.be.true;
    expect(matches).to.deep.equal({ B: { c: 1 } });
  });

  it('should match on nested objects with placeholders (2)', () => {
    const pattern = { foo: { bar: A } };
    const value = Map({ foo: Map({ bar: 'hello' }), baz: 'world' });
    const [status, matches] = match(pattern, value);
    expect(status).to.be.true;
    expect(matches).to.deep.equal({ A: 'hello' });
  });

  it('should match based on value equality if pattern is Map (1)', () => {
    const pattern = Map({ bar: 'hello' });
    const value = { bar: 'hello' };
    const [status, matches] = match(pattern, value);
    expect(status).to.be.false;
    expect(matches).to.deep.equal({});
  });

  it('should match based on value equality if pattern is Map (2)', () => {
    const pattern = Map({ bar: _ });
    const value = { bar: 'hello' };
    const [status, matches] = match(pattern, value);
    expect(status).to.be.false;
    expect(matches).to.deep.equal({});
  });
});
