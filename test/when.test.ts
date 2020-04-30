/* eslint-disable no-unused-vars */
/* eslint-disable no-unused-expressions */
/* eslint-disable indent */
/* eslint-disable func-call-spacing */
/* eslint-disable no-spaced-func */
/* eslint-disable no-unexpected-multiline */
/* eslint-disable arrow-parens */

import { expect } from 'chai';

import { when, end, _ } from '../src';

describe('the when function: base cases', () => {
  it('should match the first matching expression (1)', () => {
    const expression = 1;
    const result = when(expression)
      (1, () => 1)
      (2, () => 2)
      (3, () => 3)
    (end);

    expect(result).to.equal(1);
  });

  it('should match the first matching expression (2)', () => {
    const expression = 2;
    const result = when(expression)
      (1, () => 1)
      (2, () => 2)
      (3, () => 3)
    (end);

    expect(result).to.equal(2);
  });

  it('should match the first matching expression (3)', () => {
    const expression = 3;
    const result = when(expression)
      (1, () => 1)
      (2, () => 2)
      (3, () => 3)
    (end);

    expect(result).to.equal(3);
  });

  it('should match a placeholder in the first position', () => {
    const expression = 4;
    const result = when(expression)
      (_, () => 1)
      (2, () => 2)
      (3, () => 3)
    (end);

    expect(result).to.equal(1);
  });

  it('should match a placeholder in the middle position', () => {
    const expression = 4;
    const result = when(expression)
      (1, () => 1)
      (_, () => 2)
      (3, () => 3)
    (end);

    expect(result).to.equal(2);
  });

  it('should match a placeholder in the last position', () => {
    const expression = 4;
    const result = when(expression)
      (1, () => 1)
      (2, () => 2)
      (_, () => 3)
    (end);

    expect(result).to.equal(3);
  });
});

describe('the when function: pattern matching', () => {
  it('should pattern match on arrays', () => {
    const expression = [1, 2, 3];
    const result = when(expression)
      (1, () => 1)
      ([1, 2, _], () => 2)
      (3, () => 3)
    (end);

    expect(result).to.equal(2);
  });

  it('should pattern match on objects', () => {
    const expression = { a: 1, b: 2, c: 3 };
    const result = when(expression)
      (1, () => 1)
      ({ a: _, b: 2 }, () => 2)
      (3, () => 3)
    (end);

    expect(result).to.equal(2);
  });

  it('should pattern match on named functions', () => {
    function a() { return false; }
    function b() { return false; }

    const result = when({ a, b })
      (1, () => 1)
      ({ a }, () => 2)
      (3, () => 3)
    (end);

    expect(result).to.equal(2);
  });

  it('should pattern match on named functions with placeholders', () => {
    function a() { return false; }
    function b() { return false; }

    const result = when({ a, b })
      (1, () => 1)
      ({ a: _ }, () => 2)
      (3, () => 3)
    (end);

    expect(result).to.equal(2);
  });

  it('should pattern match on anonymous functions if they have the same identity', () => {
    const a = () => false;

    const result = when({ a })
      (1, () => 1)
      ({ a }, () => 2)
      (_, () => 3)
    (end);

    expect(result).to.equal(2);
  });

  it('should not pattern match on anonymous functions with different identity', () => {
    const a = () => false;
    const b = () => false;

    const result = when({ a })
      (1, () => 1)
      ({ a: b }, () => 2)
      (_, () => 3)
    (end);

    expect(result).to.equal(3);
  });
});

describe('the when function: user errors', () => {
  it('should throw an error if no matching clause is found', () => {
    const expression = 4;
    const fun = () => when(expression)
      (1, () => 1)
      (2, () => 2)
      (3, () => 3)
    (end);

    expect(fun).to.throw(Error);
  });

  it('should throw an error if more than two arguments are supplied in clause', () => {
    const expression = 4;
    const fun = () => when(expression)
      (1, () => 1)
      (2, () => 2, 3)
      (3, () => 3)
    (end);

    expect(fun).to.throw(Error);
  });

  it('should throw an error if second argument to clause is not function', () => {
    const expression = 4;
    const fun = () => when(expression)
      (1, () => 1)
      (2, 3)
      (3, () => 3)
    (end);

    expect(fun).to.throw(Error);
  });

  it('should throw an error if last clause is called with argument that is not symbol \'end\'', () => {
    const expression = 2;
    const fun = () => when(expression)
      (1, () => 1)
      (2, () => 2)
      (3, () => 3)
    ('end');

    expect(fun).to.throw(Error);
  });

  it('should throw an error if last clause is called with no arguments', () => {
    const expression = 2;
    const fun = () => when(expression)
      (1, () => 1)
      (2, () => 2)
      (3, () => 3)
    ();

    expect(fun).to.throw(Error);
  });
});
