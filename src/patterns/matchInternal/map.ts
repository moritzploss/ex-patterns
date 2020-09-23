import { Map } from 'immutable';

import { Match, MatchTuple, Pattern } from '../../types';
import { MatchFunction } from '../types';

import { matchMapLike } from './mapLike';

export const matchMap = (
  pattern: Pattern,
  map: Map<any, any>,
  match: MatchFunction,
  matches: Match,
): MatchTuple => {
  const has = (key: string) => map.has(key);
  const get = (key: string) => map.get(key);
  return matchMapLike(pattern, match, matches, has, get);
};
