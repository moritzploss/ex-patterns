import { List } from 'immutable';

import { Match, MatchTuple, Pattern } from '../../types';
import { MatchFunction } from '../types';

import { matchListLike } from './listLike';

export const matchList = <T>(
  pattern: Pattern,
  list: List<T>,
  match: MatchFunction,
  matches: Match,
): MatchTuple => {
  const get = (index: number): T => list.get(index);
  return matchListLike(pattern, list, list.size, get, match, matches);
};
