import { Map } from 'immutable';

import { reduceWhile, ok, stop } from '../util/enum';
import { Match } from '../match';

import { Pattern } from './types';

type MatchTuple = [boolean, Match];
type MapLike = Object | Map<string, any>;

const matchMap = (pattern: Pattern, map: MapLike, _match: Function, matches: Match, has: Function, get: Function) => {
  const reducer = ([isMatch, acc]: MatchTuple, [key, val]: [string, Pattern]) => {
    if (has(map, key)) {
      [isMatch, acc] = _match(val, get(map, key), acc); // eslint-disable-line no-param-reassign
      if (isMatch) {
        return [ok, [true, acc]];
      }
    }
    return [stop, [false, {}]];
  };
  return reduceWhile(Object.entries(pattern), [true, matches], reducer);
};

export { matchMap };
