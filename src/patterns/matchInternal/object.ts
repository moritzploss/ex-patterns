import { Match, MatchTuple, Pattern } from '../../types';
import { MatchFunction } from '../types';

import { matchMapLike } from './mapLike';
import { hasKey } from '../../util';

export const matchObject = (
  pattern: Pattern,
  object: Record<string, any>,
  match: MatchFunction,
  matches: Match,
): MatchTuple => {
  const has = (key: string) => hasKey(object, key);
  const get = (key: string) => object[key];
  return matchMapLike(pattern, match, matches, has, get);
};
