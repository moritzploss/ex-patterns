/* eslint-disable no-unused-vars */
/* eslint-disable no-unused-expressions */

import { expect } from 'chai';

import { isMatch, _ } from '../../src';

describe('the isMatch function: primitives', () => {
  it('should match two numbers if they are equal', () => {
    const status = isMatch(1, 1);
    expect(status).to.be.true;
  });

  it('should not match two numbers if they are not equal', () => {
    const status = isMatch(1, 2);
    expect(status).to.be.false;
  });
});
