import { isUnnamedPlaceholder, isNamedPlaceholder, isPlaceholder } from '../placeholders';
import { matchArray } from './array';
import { matchMap } from './map';
import { equals, isObject, isArray, isMap, isList, isFunction, hasKey } from '../util';
import { MatchFunction } from './types';
import { Match, MatchTuple, Pattern, Placeholder } from '../types';

const updateMatch = (match: Match, { lookupName }: Placeholder, value: any): MatchTuple => {
  if (!hasKey(match, lookupName)) {
    // eslint-disable-next-line no-param-reassign
    match[lookupName] = value;
    return [true, match];
  }
  if (equals(match[lookupName], value)) {
    return [true, match];
  }
  return [false, match];
};

const matchNamedPlaceholder = (pattern: Pattern, value: any, matches: Match, _match: MatchFunction): MatchTuple => {
  // placeholder is used as is
  if (isFunction(pattern)) {
    return updateMatch(matches, pattern, value);
  }
  // placeholder is used for as-patterns and has been called with subPattern
  const [isSuccess, newMatches] = updateMatch(matches, pattern, value);
  if (isSuccess) {
    // if as-pattern capture was successful, continue to match against subPattern
    return _match(pattern.subPattern, value, newMatches);
  }
  return [false, newMatches];
};

export const _match: MatchFunction = (pattern: Pattern, value: any, matches = {}) => {
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
      const get = (index: number) => value.get(index);
      return matchArray(pattern, value, value.size, get, _match, matches);
    }
    if (isArray(value)) {
      const get = (index: number) => value[index];
      return matchArray(pattern, value, value.length, get, _match, matches);
    }
  }

  if (isObject(pattern)) {
    if (isMap(value)) {
      const has = (key: string) => value.has(key);
      const get = (key: string) => value.get(key);
      return matchMap(pattern, _match, matches, has, get);
    }
    if (isObject(value)) {
      const has = (key: string) => hasKey(value, key);
      const get = (key: string) => value[key];
      return matchMap(pattern, _match, matches, has, get);
    }
  }

  return [false, matches];
};
