/* eslint-disable no-unused-vars */
/* eslint-disable no-unused-expressions */

import { expect } from 'chai';

import { match, _, A, B, C } from '../../src';

describe('the match function: parent capturing', () => {
  it('should be able to capture parent matches', () => {
    const pattern = A({ user: B });
    const value = { user: 'Amelie' };
    const [status, matches] = match(pattern, value);

    expect(status).to.be.true;
    expect(matches).to.deep.equal({ A: { user: 'Amelie' }, B: 'Amelie' });
  });

  it('should not match if there are conflicting parent captures', () => {
    const pattern = [B, B({ user: A })];
    const value = [{ user: 'Amelie' }, { user: 'Jules' }];
    const [status, matches] = match(pattern, value);

    expect(status).to.be.false;
    expect(matches).to.deep.equal({});
  });

  it('should resolve non-conflicting parent captures', () => {
    const pattern = [B, B({ user: A })];
    const value = [{ user: 'Amelie' }, { user: 'Amelie' }];
    const [status, matches] = match(pattern, value);

    expect(status).to.be.true;
    expect(matches).to.deep.equal({ B: { user: 'Amelie' }, A: 'Amelie' });
  });

  it('should not match if there are conflicting nested parent captures', () => {
    const pattern = [B, B({ user: A({ nickname: C }) })];

    const names = { nickname: 'Ami', name: 'Amelie' };
    const user = { user: names };
    const value = [user, { names: { ...names, nickname: 'Amy' } }];

    const [status, matches] = match(pattern, value);

    expect(status).to.be.false;
    expect(matches).to.deep.equal({ });
  });

  it('should perform nested parent captures', () => {
    const pattern = [B, B({ user: A({ nickname: C }) })];

    const names = { nickname: 'Ami', name: 'Amelie' };
    const user = { user: names };
    const value = [user, user];

    const [status, matches] = match(pattern, value);

    expect(status).to.be.true;
    expect(matches).to.deep.equal({ B: user, A: names, C: 'Ami' });
  });

  it('should work with arrays', () => {
    const pattern = A([1, 2, B]);
    const value = [1, 2, 3];
    const [status, matches] = match(pattern, value);

    expect(status).to.be.true;
    expect(matches).to.deep.equal({ A: [1, 2, 3], B: 3 });
  });
});
