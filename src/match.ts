import * as R from 'ramda';

import { namedPlaceholders, toString } from './placeholder';
import { hasKey } from './util';

export type Match = Record<typeof namedPlaceholders[number] | undefined, any>;

const updateMatch = (match: Match, name: Symbol, value: any): [boolean, Match] => {
  const key = toString(name);

  if (!hasKey(match, key)) {
    // eslint-disable-next-line no-param-reassign
    match[key] = value;
    return [true, match];
  }

  if (R.equals(match[key], value)) {
    return [true, match];
  }

  return [false, match];
};


export { updateMatch };
