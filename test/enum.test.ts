import { expect } from 'chai';

import { reduceWhile, ok, stop } from '../src/enum';

describe('the reduceWhile function', () => {
  it('should work as expected', () => {
    const start = [1, 2, 3, 4, 5];

    const result = reduceWhile(start, 0, (acc, element) => {
      if (acc + element < 10) {
        return [ok, acc + element];
      }
      return [stop, acc];
    });

    expect(result).to.equal(6);
  });
});
