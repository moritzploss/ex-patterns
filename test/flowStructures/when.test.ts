/* eslint-disable no-unused-vars */
/* eslint-disable no-unused-expressions */
/* eslint-disable indent */
/* eslint-disable func-call-spacing */
/* eslint-disable no-spaced-func */
/* eslint-disable no-unexpected-multiline */
/* eslint-disable arrow-parens */

import { expect } from 'chai';

import { when, then, end, _, A, B, C, N } from '../../src';

describe('the when function: base cases', () => {
  it('should match the first matching value (1)', () => {
    const value = 1;
    const result = when(value)
      (1, then(() => 1))
      (2, then(() => 2))
      (3, then(() => 3))
    (end);

    expect(result).to.equal(1);
  });

  it('should match the first matching value (2)', () => {
    const value = 2;
    const result = when(value)
      (1, then(() => 1))
      (2, then(() => 2))
      (3, then(() => 3))
    (end);

    expect(result).to.equal(2);
  });

  it('should match the first matching value (3)', () => {
    const value = 3;
    const result = when(value)
      (1, then(() => 1))
      (2, then(() => 2))
      (3, then(() => 3))
    (end);

    expect(result).to.equal(3);
  });

  it('should work with only one match clause', () => {
    const value = 3;
    const result = when(value)
      (3, then(() => 3))
    (end);

    expect(result).to.equal(3);
  });

  it('should match a placeholder in the first position', () => {
    const value = 4;
    const result = when(value)
      (_, then(() => 1))
      (2, then(() => 2))
      (3, then(() => 3))
    (end);

    expect(result).to.equal(1);
  });

  it('should match a placeholder in the middle position', () => {
    const value = 4;
    const result = when(value)
      (1, then(() => 1))
      (_, then(() => 2))
      (3, then(() => 3))
    (end);

    expect(result).to.equal(2);
  });

  it('should match a placeholder in the last position', () => {
    const value = 4;
    const result = when(value)
      (1, then(() => 1))
      (2, then(() => 2))
      (_, then(() => 3))
    (end);

    expect(result).to.equal(3);
  });
});

describe('the when function: pattern matching', () => {
  it('should pattern match on arrays', () => {
    const value = [1, 2, 3];
    const result = when(value)
      (1, then(() => 1))
      ([1, 2, _], then(() => 2))
      (3, then(() => 3))
    (end);

    expect(result).to.equal(2);
  });

  it('should pattern match on objects', () => {
    const value = { a: 1, b: 2, c: 3 };
    const result = when(value)
      (1, then(() => 1))
      ({ a: _, b: 2 }, then(() => 2))
      (3, then(() => 3))
    (end);

    expect(result).to.equal(2);
  });

  it('should pattern match on named functions', () => {
    function a() { return false; }
    function b() { return false; }

    const result = when({ a, b })
      (1, then(() => 1))
      ({ a }, then(() => 2))
      (3, then(() => 3))
    (end);

    expect(result).to.equal(2);
  });

  it('should pattern match on named functions with placeholders', () => {
    function a() { return false; }
    function b() { return false; }

    const result = when({ a, b })
      (1, then(() => 1))
      ({ a: _ }, then(() => 2))
      (3, then(() => 3))
    (end);

    expect(result).to.equal(2);
  });

  it('should pattern match on anonymous functions if they have the same identity', () => {
    const a = () => false;

    const result = when({ a })
      (1, then(() => 1))
      ({ a }, then(() => 2))
      (_, then(() => 3))
    (end);

    expect(result).to.equal(2);
  });

  it('should not pattern match on anonymous functions with different identity', () => {
    const a = () => false;
    const b = () => false;

    const result = when({ a })
      (1, then(() => 1))
      ({ a: b }, then(() => 2))
      (_, then(() => 3))
    (end);

    expect(result).to.equal(3);
  });
});

describe('the when function: callbacks', () => {
  it('should pass in named matches as first argument to callback', () => {
    const value = [1, 2, 3];
    const result = when(value)
      (1, then(() => 1))
      ([1, A, B], then(({ A: second, B: third }) => [second, third]))
      (3, then(() => 3))
    (end);

    expect(result).to.deep.equal([2, 3]);
  });

  it('should pass in value as second argument to callback', () => {
    const value = 5;
    const result = when(value)
      (_, then((matches, val) => val))
      (2, then(() => 2))
      (3, then(() => 3))
    (end);

    expect(result).to.equal(5);
  });

  it('should pass in pattern as third argument to callback', () => {
    const value = [1, 2, 3];
    const pattern = [1, A, B];
    const result = when(value)
      (1, then(() => 1))
      (pattern, then((matches, val, patt) => patt))
      (3, then(() => 3))
    (end);

    expect(result).to.deep.equal(pattern);
  });

  it('should work as expected', () => {
    const value = { foo: 1, bar: 5 };
    const callback = (matches, val, pattern) => [matches, val, pattern];

    const result = when(value)
        (1, then(() => 'foo'))
        ({ bar: A }, then(callback))
        (_, then(() => 'baz'))
    (end);

    expect(result).to.deep.equal([{ A: 5 }, { foo: 1, bar: 5 }, { bar: A }]);
  });
});

describe('the when function: user errors', () => {
  it('should throw an error if no match clause is provided', () => {
    const value = 4;
    const fun = () => when(value)
    (end);

    expect(fun).to.throw(Error);
  });

  it('should throw an error if no matching clause is found', () => {
    const value = 4;
    const fun = () => when(value)
      (1, then(() => 1))
      (2, then(() => 2))
      (3, then(() => 3))
    (end);

    expect(fun).to.throw(Error);
  });

  it('should throw an error if more than two arguments are supplied in clause', () => {
    const value = 4;
    const fun = () => when(value)
      (1, then(() => 1))
      (2, then(() => 2), 3)
      (3, then(() => 3))
    (end);

    expect(fun).to.throw(Error);
  });

  it('should throw an error if second argument to clause is not function', () => {
    const value = 4;
    const fun = () => when(value)
      (1, then(() => 1))
      (2, 3)
      (3, then(() => 3))
    (end);

    expect(fun).to.throw(Error);
  });

  it('should throw an error if last clause is called with no arguments', () => {
    const value = 2;
    const fun = () => when(value)
      (1, then(() => 1))
      (2, then(() => 2))
      (3, then(() => 3))
    ();

    expect(fun).to.throw(Error);
  });
});

describe('the when function: all together now', () => {
  it('should work with real life example', () => {
    const user = {
      name: 'David',
      city: 'Gothenburg',
    };

    const logMissingCity = ({ A: name }) => console.log(`no city for user ${name}`);
    const logNotAUser = (matches, data) => console.log('not a valid user', data);

    const moveTo = (user, city) => (
      when(user)
        ({ name: _, city }, then(() => user))
        ({ name: _, city: _ }, then(() => ({ ...user, city })))
        ({ name: A }, then(logMissingCity))
        (_, then(logNotAUser))
      (end)
    );

    const result = when(moveTo(user, 'Stockholm'))
      ({ city: C }, then(({ C: city }) => `moved user from ${user.city} to ${city}!`))
      (_, then(() => 'something went wrong! check the logs!'))
    (end);

    expect(result).to.deep.equal('moved user from Gothenburg to Stockholm!');
  });

  it('should work for example from README', () => {
    const user = { name: 'Amelie' };

    const result = when(user)
        ({ alias: A }, then((match) => `Hi ${match.A}!`))
        ({ name: N }, then((match) => `Hi ${match.N}!`))
        (_, then(() => 'Hi!'))
    (end);

    expect(result).to.deep.equal('Hi Amelie!');
  });
});

describe('the when function: partial application', () => {
  it('should be possible to partially apply when', () => {
    const result = when(true)
      (false)(() => 1)
      (true)(() => 2)
      (_)(() => 3)
    (end);

    expect(result).to.equal(2);
  });
});
