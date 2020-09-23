/* eslint-disable no-unused-vars */
/* eslint-disable no-unused-expressions */
/* eslint-disable indent */
/* eslint-disable func-call-spacing */
/* eslint-disable no-spaced-func */
/* eslint-disable arrow-parens */

import { expect } from 'chai';
import { Map, List, Set, OrderedSet, is } from 'immutable';

import { match, _, A, B, C, head, tail } from '../../src';

describe('the match function: Immutable.js Collections', () => {
  describe('Lists', () => {
    it('should match an array against a List if they have same elements', () => {
      const [status] = match([1, 2], List([1, 2]));
      expect(status).to.be.true;
    });

    it('should work with List as pattern', () => {
      const [status] = match(List([1]), List([1]));
      expect(status).to.be.true;
    });

    it('should not match an array against a List if they don\'t have same elements', () => {
      const [status] = match([1], List([2]));
      expect(status).to.be.false;
    });

    it('should match on single placeholder in array', () => {
      const [status] = match([1, _, 3, 4], List([1, 2, 3, 4]));
      expect(status).to.be.true;
    });

    it('should match on multiple placeholders in array', () => {
      const [status] = match([1, _, 3, _, 5], List([1, 2, 3, 4, 5]));
      expect(status).to.be.true;
    });

    it('should not match if the pattern array is longer than the value (1)', () => {
      const [status] = match([1, _], List([1]));
      expect(status).to.be.false;
    });

    it('should not match if the pattern array is longer than the value (2)', () => {
      const [status] = match([1, 2], List([1]));
      expect(status).to.be.false;
    });

    it('should not match if pattern elements are in the wrong order', () => {
      const [status] = match([2, 1], List([1, 2]));
      expect(status).to.be.false;
    });

    it('should not match if pattern elements are in the wrong order, even with placeholder', () => {
      const [status] = match([_, 1], List([1, 2]));
      expect(status).to.be.false;
    });

    it('should match nested Lists (1)', () => {
      const [status] = match([1, [2, 3]], List([1, List([2, 3])]));
      expect(status).to.be.true;
    });

    it('should match nested Lists (2)', () => {
      const [status] = match([[2, 3], 1], List([List([2, 3]), 1]));
      expect(status).to.be.true;
    });

    it('should match nested Lists with placeholders (1)', () => {
      const [status] = match([[2, 3], _], List([List([2, 3]), 1]));
      expect(status).to.be.true;
    });

    it('should match nested Lists with placeholders (2)', () => {
      const [status] = match([_, 1], List([List([2, 3]), 1]));
      expect(status).to.be.true;
    });

    it('should match nested Lists with placeholders (3)', () => {
      const [status] = match([_, _], List([List([2, 3]), 1]));
      expect(status).to.be.true;
    });
  });

  describe('Maps', () => {
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

    it('should match on named placeholders as object values', () => {
      const [status, matches] = match({ a: A, b: A }, Map({ a: 1, b: 2 }));
      expect(status).to.be.false;
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

  describe('Sets', () => {
    it('should match an array against a Set if they have same elements', () => {
      const [status] = match([1, 2], Set([1, 2]));
      expect(status).to.be.true;
    });

    it('should match an array against a Set irrespective of order', () => {
      const [status] = match([2, 1], Set([1, 2]));
      expect(status).to.be.true;
    });

    it('should work with Set as pattern', () => {
      const [status] = match(Set([1, 2]), Set([1, 2]));
      expect(status).to.be.true;
    });

    it('should not match an array against a List if they don\'t have same elements', () => {
      const [status] = match([1], Set([2]));
      expect(status).to.be.false;
    });

    it('should match on single placeholder in array', () => {
      const [status] = match([1, _, 3, 4], Set([1, 2, 3, 4]));
      expect(status).to.be.true;
    });

    it('should match on multiple placeholders in array', () => {
      const [status] = match([1, _, 3, _, 5], Set([1, 2, 3, 4, 5]));
      expect(status).to.be.true;
    });

    it('should match on multiple placeholders irrespective of order', () => {
      const [status] = match([_, _, 1, 3, 5], Set([1, 2, 3, 4, 5]));
      expect(status).to.be.true;
    });

    it('should not match if the pattern array is longer than the value (1)', () => {
      const [status] = match([1, _], Set([1]));
      expect(status).to.be.false;
    });

    it('should not match if the pattern array is longer than the value (2)', () => {
      const [status] = match([1, 2], Set([1]));
      expect(status).to.be.false;
    });

    it('should match if pattern elements are in the wrong order, even with placeholder', () => {
      const [status] = match([_, 1], Set([1, 2]));
      expect(status).to.be.true;
    });

    it('should match nested Sets (1)', () => {
      const [status] = match([1, [2, 3]], Set([1, Set([2, 3])]));
      expect(status).to.be.true;
    });

    it('should match nested Sets (2)', () => {
      const [status] = match([[2, 3], 1], Set([Set([2, 3]), 1]));
      expect(status).to.be.true;
    });

    it('should match nested Sets with placeholders (1)', () => {
      const [status] = match([[2, 3], _], Set([Set([2, 3]), 1]));
      expect(status).to.be.true;
    });

    it('should match nested Sets with placeholders (2)', () => {
      const [status] = match([_, 1], Set([Set([2, 3]), 1]));
      expect(status).to.be.true;
    });

    it('should match nested Sets with placeholders (3)', () => {
      const [status] = match([_, _], Set([Set([2, 3]), 1]));
      expect(status).to.be.true;
    });

    it('should throw an error when matched against named placeholder', () => {
      const func = () => match([A, 2], Set([1, 2]));
      expect(func).to.throw(Error);
    });

    it('should throw an error when matched against "head" placeholder', () => {
      const func = () => match([head, 2], Set([1, 2]));
      expect(func).to.throw(Error);
    });

    it('should throw an error when matched against "tail" placeholder', () => {
      const func = () => match([1, tail], Set([1, 2]));
      expect(func).to.throw(Error);
    });
  });

  describe('OrderedSets', () => {
    it('should match an array against an OrderedSet if they have same elements', () => {
      const [status] = match([1, 2], OrderedSet([1, 2]));
      expect(status).to.be.true;
    });

    it('should not match an array against an OrderedSet with wrong order', () => {
      const [status] = match([2, 1], OrderedSet([1, 2]));
      expect(status).to.be.false;
    });

    it('should work with OrderedSet as pattern', () => {
      const [status] = match(OrderedSet([1, 2]), OrderedSet([1, 2]));
      expect(status).to.be.true;
    });

    it('should work with OrderedSet as pattern (2)', () => {
      const [status] = match(OrderedSet([2, 1]), OrderedSet([1, 2]));
      expect(status).to.be.false;
    });

    it('should not match an array against an OrderedSet if they don\'t have same elements', () => {
      const [status] = match([1], OrderedSet([2]));
      expect(status).to.be.false;
    });

    it('should match on single placeholder in array', () => {
      const [status] = match([1, _, 3, 4], OrderedSet([1, 2, 3, 4]));
      expect(status).to.be.true;
    });

    it('should match on multiple placeholders in array', () => {
      const [status] = match([1, _, 3, _, 5], OrderedSet([1, 2, 3, 4, 5]));
      expect(status).to.be.true;
    });

    it('should match on multiple placeholders in correct order', () => {
      const [status] = match([1, _, 3, _, 5], OrderedSet([1, 2, 3, 4, 5]));
      expect(status).to.be.true;
    });

    it('should not match if the pattern array is longer than the value (1)', () => {
      const [status] = match([1, _], OrderedSet([1]));
      expect(status).to.be.false;
    });

    it('should not match if the pattern array is longer than the value (2)', () => {
      const [status] = match([1, 2], OrderedSet([1]));
      expect(status).to.be.false;
    });

    it('should not match if pattern elements are in the wrong order, even with placeholder', () => {
      const [status] = match([_, 1], OrderedSet([1, 2]));
      expect(status).to.be.false;
    });

    it('should match nested Sets (1)', () => {
      const [status] = match([1, [2, 3]], OrderedSet([1, OrderedSet([2, 3])]));
      expect(status).to.be.true;
    });

    it('should match nested Sets (2)', () => {
      const [status] = match([[2, 3], 1], OrderedSet([OrderedSet([2, 3]), 1]));
      expect(status).to.be.true;
    });

    it('should match nested Sets with placeholders (1)', () => {
      const [status] = match([[2, 3], _], OrderedSet([OrderedSet([2, 3]), 1]));
      expect(status).to.be.true;
    });

    it('should match nested Sets with placeholders (2)', () => {
      const [status] = match([_, 1], OrderedSet([OrderedSet([2, 3]), 1]));
      expect(status).to.be.true;
    });

    it('should match nested Sets with placeholders (3)', () => {
      const [status] = match([_, _], OrderedSet([OrderedSet([2, 3]), 1]));
      expect(status).to.be.true;
    });

    it('should match against named placeholder', () => {
      const [status, matches] = match([A, 2], OrderedSet([1, 2]));
      expect(status).to.be.true;
      expect(matches).to.deep.equal({ A: 1 });
    });

    it('should match against named placeholder (1)', () => {
      const [status, matches] = match(A, OrderedSet([1, 2]));
      expect(status).to.be.true;
      expect(matches).to.deep.equal({ A: OrderedSet([1, 2]) });
    });

    it('should match against "head" placeholder', () => {
      const [status, matches] = match([head(A), 2], OrderedSet([1, 2]));
      expect(status).to.be.true;
      expect(matches).to.deep.equal({ A: OrderedSet([1]) });
    });

    it('should match against "tail" placeholder', () => {
      const [status, matches] = match([1, tail(A)], OrderedSet([1, 2]));
      expect(status).to.be.true;
      expect(matches).to.deep.equal({ A: OrderedSet([2]) });
    });
  });
});
