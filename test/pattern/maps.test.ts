/* eslint-disable no-unused-vars */
/* eslint-disable no-unused-expressions */
/* eslint-disable indent */
/* eslint-disable func-call-spacing */
/* eslint-disable no-spaced-func */
/* eslint-disable arrow-parens */

import { expect } from 'chai';

import { match, _, A, B, C } from '../../src';

describe('the match function: JS maps', () => {
  it('should match two JS maps if they are equal', () => {
    const map = new Map();
    map.set('a', 1);

    const [status, matches] = match(map, map);
    expect(status).to.be.true;
    expect(matches).to.deep.equal({});
  });

  it('should match object and JS map', () => {
    const map = new Map();
    map.set('a', 1);

    const [status, matches] = match({ a: 1 }, map);
    expect(status).to.be.true;
    expect(matches).to.deep.equal({});
  });
});
