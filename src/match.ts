import { hasKey, equals } from './util';
import { Match, MatchTuple, Placeholder } from './types';

const updateMatch = (match: Match, { lookupName }: Placeholder, value: any): MatchTuple => {
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
