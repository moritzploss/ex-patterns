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

describe('the isMatch function: partial application', () => {
  it('should be possible to partially apply isMatch', () => {
    const status1 = isMatch()(1)(1);
    expect(status1).to.be.true;

    const status2 = isMatch(1)(1);
    expect(status2).to.be.true;

    const status3 = isMatch(1, 1);
    expect(status3).to.be.true;
  });
});
