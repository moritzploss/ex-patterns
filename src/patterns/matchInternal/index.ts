import * as I from 'immutable';

import { MatchFunction } from '../types';
import { Match, MatchTuple, Pattern, Placeholder } from '../../types';

import { isUnnamedPlaceholder, isNamedPlaceholder, isPlaceholder } from '../../placeholders';
import { equals, isObject, isArray, isList, isMap, isSeq, isSet, isFunction, hasKey, isOrderedSet, isJsMap } from '../../util';

import { matchArray } from './array';
import { matchIndexedSeq } from './indexedSeq';
import { matchList } from './list';
import { matchMap } from './map';
import { matchObject } from './object';
import { matchOrderedSet } from './orderedSet';
import { matchSet } from './set';

const updateMatch = (match: Match, { lookupName }: Placeholder, value: any): MatchTuple => {
  if (hasKey(match, lookupName)) {
    return [equals(match[lookupName], value), match];
  }
  // eslint-disable-next-line no-param-reassign
  match[lookupName] = value;
  return [true, match];
};

const matchNamedPlaceholder = (
  pattern: Pattern,
  value: any,
  matches: Match,
  _match: MatchFunction,
): MatchTuple => {
  // placeholder is used as is
  if (isFunction(pattern)) {
    return updateMatch(matches, pattern, value);
  }
  // placeholder is used for as-patterns and has been called with subPattern
  const [isSuccess, newMatches] = updateMatch(matches, pattern, value);
  if (isSuccess) {
    return _match(pattern.subPattern, value, newMatches);
  }
  return [false, newMatches];
};

const _match: MatchFunction = (pattern: Pattern, value: any, matches = {}) => {
  if (isPlaceholder(value)) {
    throw Error('Right side of match cannot contain placeholder.');
  }

  if (isUnnamedPlaceholder(pattern)) {
    return [true, matches];
  }

  if (isNamedPlaceholder(pattern)) {
    return matchNamedPlaceholder(pattern, value, matches, _match);
  }

  if (equals(pattern, value)) {
    return [true, matches];
  }

  if (isArray(pattern)) {
    if (isList(value)) {
      return matchList(pattern, value as I.List<any>, _match, matches);
    }
    if (isSeq(value)) {
      return matchIndexedSeq(pattern, value as I.Seq.Indexed<any>, _match, matches);
    }
    if (isOrderedSet(value)) {
      return matchOrderedSet(pattern, value as I.OrderedSet<any>, _match, matches);
    }
    if (isSet(value)) {
      return matchSet(pattern, value as I.Set<any>, _match, matches);
    }
    if (isArray(value)) {
      return matchArray(pattern, value as any[], _match, matches);
    }
  }

  if (isObject(pattern)) {
    if (isMap(value)) {
      return matchMap(pattern, value as I.Map<any, any>, _match, matches);
    }
    if (isObject(value)) {
      return matchObject(pattern, value as Record<string, any>, _match, matches);
    }
    if (isJsMap(value)) {
      return matchMap(pattern, value as Map<any, any>, _match, matches);
    }
  }

  return [false, matches];
};

export { _match };
