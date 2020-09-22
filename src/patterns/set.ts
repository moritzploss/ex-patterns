import { Set } from 'immutable';

import { reduceWhile } from '../util/enum';
import { Match, MatchTuple, Pattern, Placeholder } from '../types';
import { ReservedKeyword } from '../keywords/types';
import { isReservedKeyword } from '../keywords';
import { MatchFunction } from './types';
import { isNamedPlaceholder } from '../placeholders';
import { isArray } from '../util';
import { isMatchOrBreak } from './util';

const getFromSet = (value: Set<any>) => (elm: any) => {
  if (isNamedPlaceholder(elm)) {
    throw new Error(`Cannot match named placeholder "${(elm as Placeholder).lookupName}" against immutable Set`);
  }
  return isArray(elm)
    ? value.get(elm) || value.get(Set(elm))
    : value.get(elm);
};

const matchSet = (pattern: Pattern, set: Set<any>, match: MatchFunction, matches: Match): MatchTuple => {
  if (pattern.length !== set.size) {
    return [false, {}];
  }

  const get = getFromSet(set);

  const reducer = ({ 1: accumulator }: MatchTuple, elm: any) => {
    if (isReservedKeyword(elm)) {
      throw Error(`Cannot use reserved keyword "${(elm as ReservedKeyword).lookupName}" in Set.`);
    }
    return isMatchOrBreak(...match(elm, get(elm), accumulator));
  };

  return reduceWhile(reducer, [true, matches] as MatchTuple, pattern);
};

export { matchSet };
