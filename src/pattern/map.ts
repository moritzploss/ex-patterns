import { Map } from 'immutable';

import { reduceWhile, ok, stop } from '../util/enum';
import { hasKey } from '../util';
import { Match } from '../match';

import { Pattern } from './types';

type MatchTuple = [boolean, Match];

const matchObject = (pattern: Pattern, object: Object, matchFunc: Function, matches: Match) => {
  const reducer = ([isMatch, acc]: MatchTuple, [key, val]: [string, Pattern]) => {
    if (hasKey(object, key)) {
      [isMatch, acc] = matchFunc(val, object[key], acc); // eslint-disable-line no-param-reassign
      if (isMatch) {
        return [ok, [true, acc]];
      }
    }
    return [stop, [false, {}]];
  };
  return reduceWhile(Object.entries(pattern), [true, matches], reducer);
};

const matchMap = (pattern: Pattern, map: Map<string, any>, matchFunc: Function, matches: Match) => {
  const reducer = ([isMatch, acc]: MatchTuple, [key, val]: [string, Pattern]) => {
    if (map.has(key)) {
      [isMatch, acc] = matchFunc(val, map.get(key), acc); // eslint-disable-line no-param-reassign
      if (isMatch) {
        return [ok, [true, acc]];
      }
    }
    return [stop, [false, {}]];
  };
  return reduceWhile(Object.entries(pattern), [true, matches], reducer);
};

export { matchObject, matchMap };
