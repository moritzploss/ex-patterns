/* eslint-disable no-unused-vars */
/* eslint-disable no-unused-expressions */

import { expect } from 'chai';

import { match, _ } from '../../src';

describe('the match function: primitives', () => {
  it('should match two numbers if they are equal', () => {
    const [status] = match(1, 1);
    expect(status).to.be.true;
  });

  it('should not match two numbers if they are not equal', () => {
    const [status] = match(1, 2);
    expect(status).to.be.false;
  });

  it('should match a placeholder with a number', () => {
    const [status] = match(_, 2);
    expect(status).to.be.true;
  });

  it('should match two booleans if they are equal', () => {
    const [status] = match(true, true);
    expect(status).to.be.true;
  });

  it('should not match two booleans if they are not equal', () => {
    const [status] = match(true, false);
    expect(status).to.be.false;
  });

  it('should not match falsy values with booleans', () => {
    const [status] = match(0, false);
    expect(status).to.be.false;
  });

  it('should not match booleans with falsy values', () => {
    const [status] = match(false, 0);
    expect(status).to.be.false;
  });

  it('should match two strings if they are equal', () => {
    const [status] = match('hello', 'hello');
    expect(status).to.be.true;
  });

  it('should not match two strings if they are not equal', () => {
    const [status] = match('hello', 'world');
    expect(status).to.be.false;
  });

  it('should match a placeholder with a string', () => {
    const [status] = match(_, 'hello');
    expect(status).to.be.true;
  });

  it('should match on null', () => {
    const [status] = match(null, null);
    expect(status).to.be.true;
  });

  it('should match a placeholder with null', () => {
    const [status] = match(_, null);
    expect(status).to.be.true;
  });

  it('should match on undefined', () => {
    const [status] = match(undefined, undefined);
    expect(status).to.be.true;
  });

  it('should not match null and undefined', () => {
    let [status, matches] = match(null, undefined);
    expect(status).to.be.false;

    [status, matches] = match(null, undefined);
    expect(status).to.be.false;
  });

  it('should match a placeholder with null', () => {
    const [status] = match(_, undefined);
    expect(status).to.be.true;
  });

  it('should match two BigInts if they are equal', () => {
    const [status] = match(BigInt(1), BigInt(1));
    expect(status).to.be.true;
  });

  it('should not match two BigInts if they are not equal', () => {
    const [status] = match(BigInt(1), BigInt(2));
    expect(status).to.be.false;
  });

  it('should match a placeholder with a BigInt', () => {
    const [status] = match(_, BigInt(1));
    expect(status).to.be.true;
  });
});
