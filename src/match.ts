import { Placeholder } from './placeholder';
import { hasKey, equals } from './util';

export type Match = Record<string, any>;

const updateMatch = (match: Match, { lookupName }: Placeholder, value: any): [boolean, Match] => {
  if (!hasKey(match, lookupName)) {
    // eslint-disable-next-line no-param-reassign
    match[lookupName] = value;
    return [true, match];
  }
  if (equals(match[lookupName], value)) {
    return [true, match];
  }
  return [false, match];
};

export { updateMatch };
