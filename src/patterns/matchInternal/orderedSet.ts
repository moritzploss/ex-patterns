import { OrderedSet } from 'immutable';

import { Match, MatchTuple, Pattern } from '../../types';
import { MatchFunction } from '../types';

import { matchIndexedSeq } from './indexedSeq';

export const matchOrderedSet = (
  pattern: Pattern,
  set: OrderedSet<any>,
  match: MatchFunction,
  matches: Match,
): MatchTuple => matchIndexedSeq(pattern, set.toIndexedSeq(), match, matches);
