/* eslint-disable no-unused-vars */
/* eslint-disable no-unused-expressions */
/* eslint-disable indent */
/* eslint-disable func-call-spacing */
/* eslint-disable no-spaced-func */
/* eslint-disable arrow-parens */

import { expect } from 'chai';

import { match, _, A, B, C } from '../../src';

describe('the match function: objects', () => {
  it('should match two objects if they are equal', () => {
    const [status, matches] = match({ a: 1 }, { a: 1 });
    expect(status).to.be.true;
    expect(matches).to.deep.equal({});
  });

  it('should not match object and array', () => {
    const [status, matches] = match({ 0: 1 }, [1]);
    expect(status).to.be.false;
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

  it('should match on named placeholders as object values', () => {
    const [status, matches] = match({ a: A, b: A }, { a: 1, b: 2 });
    expect(status).to.be.false;
    expect(matches).to.deep.equal({});
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
