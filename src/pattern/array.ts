import { reduceWhile, ok, stop } from '../util/enum';
import { isUnnamedPlaceholder, isNamedPlaceholder } from '../placeholder';
import { Match, MatchTuple, Pattern, Placeholder } from '../types';
import { Tail, Head, isTail, isHead, resolve, isReservedKeyword } from '../keywords';
import { ListLike, ListGet, MatchFunction } from './types';

const isMatchOrBreak = (isMatch: boolean, acc: Match) => (
  isMatch
    ? [ok, [true, acc]]
    : [stop, [false, {}]]
);

const getTail = (pattern: Pattern[], patternLength: number): [boolean, Tail | null] => {
  const maybeTail = pattern[patternLength - 1];
  const hasTail = isTail(maybeTail);
  return hasTail
    ? [true, resolve(maybeTail)]
    : [false, null];
};

const getHead = (pattern: Pattern[]): [boolean, Head | null] => {
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

const matchNamedHead = (
  pattern: Pattern[],
  array: ListLike,
  placeholder: Placeholder,
  lastHeadIndex: number,
  match: MatchFunction,
  matches: Match,
): MatchTuple => {
  throwIfMultipleHeads(pattern);
  const [isMatch, newMatches] = match(
    placeholder,
    array.slice(0, lastHeadIndex + 1),
    matches,
  );
  return isMatch
    ? match(pattern.slice(1), array.slice(lastHeadIndex + 1), newMatches)
    : [false, {}];
};

const matchTail = (
  placeholder: Placeholder,
  array: ListLike,
  accumulator: Match,
  i: number,
  match: MatchFunction,
) => (
  isUnnamedPlaceholder(placeholder)
    ? [stop, [true, accumulator]]
    : isMatchOrBreak(...match(placeholder, array.slice(i), accumulator))
);

const matchArray = (
  pattern: Pattern,
  array: ListLike,
  arrayLen: number,
  get: ListGet,
  match: MatchFunction,
  matches: Match,
): MatchTuple => {
  const patternLen = pattern.length;
  const tailIndex = patternLen - 1;

  if (patternLen > arrayLen + 1) {
    return [false, {}];
  }

  const [hasTail, tail] = getTail(pattern, patternLen);
  const [hasHead, head] = getHead(pattern);

  if (hasHead && hasTail) {
    throw Error('Pattern cannot have both \'head\' and \'tail\'.');
  }

  if (patternLen !== arrayLen && !(hasHead || hasTail)) {
    return [false, {}];
  }

  const lastHeadIndex = arrayLen - patternLen;

  if (hasHead && isNamedPlaceholder(head.bindTo)) {
    return matchNamedHead(pattern, array, head.bindTo, lastHeadIndex, match, matches);
  }

  const headOffset = hasHead ? lastHeadIndex : 0;

  const reducer = ({ 1: accumulator }: MatchTuple, elm: any, i: number) => {
    if (i === tailIndex && hasTail) {
      return matchTail(tail.bindTo, array, accumulator, i, match);
    }
    if (i === 0 && hasHead) {
      return [ok, [true, accumulator]];
    }
    if (isReservedKeyword(elm)) {
      throw Error(`Reserved keyword ${elm.lookupName} used in invalid position.`);
    }
    const arrayElement = get(i + headOffset);
    return isMatchOrBreak(...match(elm, arrayElement, accumulator));
  };

  return reduceWhile(reducer, [true, matches] as MatchTuple, pattern);
};

export { matchArray };
