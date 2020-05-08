/* eslint-disable no-unused-vars */
/* eslint-disable no-unused-expressions */

import { expect } from 'chai';

import { match, _, A, B, C } from '../../src';

describe('the match function: global capture', () => {
  it('should be able to capture global matches', () => {
    const pattern = A({ user: B });
    const value = { user: 'Amelie' };
    const [status, matches] = match(pattern, value);
    expect(status).to.be.true;
    expect(matches).to.deep.equal({ A: { user: 'Amelie' }, B: 'Amelie' });
  });

  it('should resolve conflicting globale captures', () => {
    const pattern = [B, B({ user: A })];
    const value = [{ user: 'Amelie' }, { user: 'Jules' }];
    const [status, matches] = match(pattern, value);
    expect(status).to.be.false;
    // expect(matches).to.deep.equal({});
  });

  it('should work like this', () => {
    const pattern = [B, B({ user: A })];
    const value = [{ user: 'Amelie' }, { user: 'Amelie' }];
    const [status, matches] = match(pattern, value);
    expect(status).to.be.true;
    // expect(matches).to.deep.equal({});
  });
});
