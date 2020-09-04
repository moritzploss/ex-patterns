import { reduceWhile, ok, stop } from '../util/enum';
import { Match, MatchTuple, Pattern } from '../types';
import { MapGet, MapHas, MatchFunction } from './types';

const matchMap = (
  pattern: Pattern,
  match: MatchFunction,
  matches: Match,
  has: MapHas,
  get: MapGet,
) => {
  const reducer = ([isMatch, acc]: MatchTuple, [key, val]: [string, Pattern]) => {
    if (has(key)) {
      [isMatch, acc] = match(val, get(key), acc); // eslint-disable-line no-param-reassign
      if (isMatch) {
        return [ok, [true, acc]];
      }
    }
    return [stop, [false, {}]];
  };
  return reduceWhile(reducer, [true, matches] as MatchTuple, Object.entries(pattern));
};

export { matchMap };
