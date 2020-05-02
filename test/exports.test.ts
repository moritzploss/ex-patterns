/* eslint-disable no-unused-vars */
/* eslint-disable no-unused-expressions */

import { expect } from 'chai';

import { A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y, Z } from '../src/index';
import { isPlaceholder } from '../src/placeholder';

const placeholders = [
  A, B, C, D, E, F,
  G, H, I, J, K, L,
  M, N, O, P, Q, R,
  S, T, U, V, W, X,
  Y, Z,
];

describe('the package', () => {
  it('should export 26 named placeholders', () => {
    expect(placeholders.length).to.deep.equal(26);
  });

  it('should export named placeholders from A to Z', () => {
    const isValidExport = placeholders.every(isPlaceholder);
    expect(isValidExport).to.be.true;
  });
});
