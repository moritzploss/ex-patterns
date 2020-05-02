import * as R from 'ramda';

import { Placeholder } from './placeholder';
import { hasKey } from './util';

export type Match = Record<string, any>;

const updateMatch = (match: Match, { name }: Placeholder, value: any): [boolean, Match] => {
  if (!hasKey(match, name)) {
    // eslint-disable-next-line no-param-reassign
    match[name] = value;
    return [true, match];
  }
  if (R.equals(match[name], value)) {
    return [true, match];
  }
  return [false, match];
};

export { updateMatch };
