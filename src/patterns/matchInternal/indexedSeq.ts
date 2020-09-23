import { Seq } from 'immutable';

import { Match, MatchTuple, Pattern } from '../../types';
import { MatchFunction } from '../types';

import { matchListLike } from './listLike';

export const matchIndexedSeq = <T>(
  pattern: Pattern,
  seq: Seq.Indexed<T>,
  match: MatchFunction,
  matches: Match,
): MatchTuple => {
  const get = (index: number): T => seq.get(index);
  return matchListLike(pattern, seq, seq.size, get, match, matches);
};
