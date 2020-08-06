import { expect } from 'chai';

import { reduceWhile, ok, stop } from '../../src/util/enum';

describe('the reduceWhile function', () => {
  it('should work as expected', () => {
    const start = [1, 2, 3, 4, 5];

    const reducer = (acc, element) => {
      if (acc + element < 10) {
        return [ok, acc + element];
      }
      return [stop, acc];
    };

    const result = reduceWhile(reducer, 0, start);

    expect(result).to.equal(6);
  });
});
