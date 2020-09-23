import { Match, MatchTuple, Pattern } from '../../types';
import { MatchFunction } from '../types';

import { matchListLike } from './listLike';

export const matchArray = <T>(
  pattern: Pattern,
  array: Array<T>,
  match: MatchFunction,
  matches: Match,
): MatchTuple => {
  const get = (index: number): T => array[index];
  return matchListLike(pattern, array, array.length, get, match, matches);
};
