import { List } from 'immutable';

import { reduceWhile, ok, stop } from '../util/enum';
import { isUnnamedPlaceholder, isNamedPlaceholder } from '../placeholder';
import { Match } from '../match';
import { Tail, Head, isTail, isHead, resolve, isReservedKeyword } from '../keywords';

import { Pattern } from './types';

type MatchTuple = [boolean, Match];
type ListLike = [] | List<any>;

const _accOrNone = (isMatch: boolean, acc: Match) => (
  isMatch
    ? [ok, [true, acc]]
    : [stop, [false, {}]]
);

const _getTail = (pattern: Pattern[], patternLength: number): [boolean, Tail | null] => {
  const maybeTail = pattern[patternLength - 1];
  const hasTail = isTail(maybeTail);
  return hasTail
    ? [true, resolve(maybeTail)]
    : [false, null];
};

const _getHead = (pattern: Pattern[]): [boolean, Head | null] => {
  const maybeHead = pattern[0];
  const hasHead = isHead(maybeHead);
  return hasHead
    ? [true, resolve(maybeHead)]
    : [false, null];
};

const throwIfMultipleHeads = (pattern: Pattern[]) => {
  pattern.forEach((element, index) => {
    if (index > 0 && isHead(element)) {
      throw Error('Pattern has multiple heads in one array.');
    }
  });
};

const _matchNamedHead = (pattern: Pattern, array: ListLike, head: Head, lastHeadIndex: number, matchFunc: Function, matches: Match) => {
  throwIfMultipleHeads(pattern);
  const [isMatch, newMatches] = matchFunc(head.bindTo, array.slice(0, lastHeadIndex + 1), matches);
  return matchFunc(pattern.slice(1), array.slice(lastHeadIndex + 1), newMatches);
};

const _matchTail = (tail: Tail, array: ListLike, acc: Match, isMatch: boolean, i: number, matchFunc: Function) => {
  if (isUnnamedPlaceholder(tail.bindTo)) {
    return [stop, [true, acc]];
  }
  [isMatch, acc] = matchFunc(tail.bindTo, array.slice(i), acc); // eslint-disable-line no-param-reassign
  return _accOrNone(isMatch, acc);
};

const matchArray = (pattern: Pattern, array: ListLike, arrayLen: number, getElement: Function, matchFunc: Function, matches: Match) => {
  const patternLen = pattern.length;
  const tailIndex = patternLen - 1;

  if (patternLen > arrayLen + 1) {
    return [false, {}];
  }

  const [hasTail, tail] = _getTail(pattern, patternLen);
  const [hasHead, head] = _getHead(pattern);

  if (hasHead && hasTail) {
    throw Error('Pattern cannot have both \'head\' and \'tail\'.');
  }

  if (patternLen !== arrayLen && !(hasHead || hasTail)) {
    return [false, {}];
  }

  const lastHeadIndex = arrayLen - patternLen;

  if (hasHead && isNamedPlaceholder(head.bindTo)) {
    return _matchNamedHead(pattern, array, head, lastHeadIndex, matchFunc, matches);
  }

  const headOffset = hasHead ? lastHeadIndex : 0;

  return reduceWhile(pattern, [true, matches], ([isMatch, acc]: MatchTuple, elm: any, i: number) => {
    if (i === tailIndex && hasTail) {
      return _matchTail(tail, array, acc, isMatch, i, matchFunc);
    }
    if (i === 0 && hasHead) {
      return [ok, [true, acc]];
    }
    if (isReservedKeyword(elm)) {
      throw Error(`Reserved keyword ${elm.name} used in invalid position.`);
    }
    const arrayElement = getElement(i + headOffset);
    [isMatch, acc] = matchFunc(elm, arrayElement, acc); // eslint-disable-line no-param-reassign
    return _accOrNone(isMatch, acc);
  });
};

export { matchArray };
