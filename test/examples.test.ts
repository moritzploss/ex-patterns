/* eslint-disable no-unused-vars */
/* eslint-disable no-unused-expressions */
/* eslint-disable indent */
/* eslint-disable func-call-spacing */
/* eslint-disable no-spaced-func */
/* eslint-disable no-unexpected-multiline */
/* eslint-disable arrow-parens */

import { expect } from 'chai';

import { match, $, when, then, end, A, N, H, _ } from '../src/index';

describe('examples in README', () => {
  it('should work as expected', () => {
    const pattern = [$('first'), $('second')];
    const value = [1, 2];

    expect(match(pattern, value)).to.deep.equal([true, { first: 1, second: 2 }]);
  });

  it('should work as expected 2', () => {
    const sayHi = (user) => when(user)
      ({ name:   N }, ({ N }) => `Hi ${N}!`)
      ({ alias:  A }, ({ A }) => `Hi ${A}!`)
      ({ handle: H }, ({ H }) => `Hi ${H}!`)
      (_, () => 'Hi!')
    (end);

    const sayHi2 = (user) => when(user)
      ({ name: N })
          (({ N }) => `Hi ${N}!`)
      ({ alias: A })
          (({ A }) => `Hi ${A}!`)
      ({ handle: H })
          (({ H }) => `Hi ${H}!`)
      (_)
          (() => 'Hi!')
    (end);

    const sayHi3 = (user) => {
      const baseGreeting = when(user)
        ({ name: N }, ({ N }) => `Hi ${N}!`);

      const withAlias = baseGreeting
        ({ alias: A }, ({ A }) => `Hi ${A}!`);

      const withHandle = withAlias
        ({ handle: H }, ({ A }) => `Hi ${A}!`);

      const withDefault = withHandle
        (_, () => 'Hi!');

      return withDefault(end);
    };

    const amelie = { name: 'Amelie' };

    expect(sayHi(amelie)).to.deep.equal('Hi Amelie!');
    expect(sayHi2(amelie)).to.deep.equal('Hi Amelie!');
    expect(sayHi3(amelie)).to.deep.equal('Hi Amelie!');
  });
});
