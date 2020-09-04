/* eslint-disable no-unused-vars */
/* eslint-disable no-unused-expressions */

import { expect } from 'chai';

import { $, match } from '../../src';
import { reservedStrings } from '../../src/symbols/index';

describe('the $ function: general', () => {
  it('should create a new named placeholder', () => {
    const placeholder = $('placeholder');
    const [, matches] = match(placeholder, 1);

    expect(matches.placeholder).to.equal(1);
  });

  it('should return existing named placeholder', () => {
    const placeholder = $('foo');
    const placeholder2 = $('foo');

    expect(placeholder).to.deep.equal(placeholder2);
  });

  it('should throw when clashing with reserved placeholder names', () => {
    reservedStrings
      .map((string) => () => $(string))
      .forEach((func) => expect(func).to.throw(Error));
  });
});

describe('the $ function: partial application', () => {
  it('should be possible to partially apply $', () => {
    const placeholder = $()('bar');
    const [, matches] = match(placeholder, 1);

    expect(matches.bar).to.equal(1);
  });
});
