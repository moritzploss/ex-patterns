import { reduceWhile, ok, stop } from '../util/enum';
import { isUnnamedPlaceholder, isNamedPlaceholder } from '../placeholder';
import { Match, MatchTuple, Pattern, Placeholder } from '../types';
import { Tail, Head, isTail, isHead, resolve, isReservedKeyword } from '../keywords';
import { ListLike, ListGet, MatchFunction } from './types';

const _accumulatorOrNone = (isMatch: boolean, acc: Match) => (
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

const _throwIfMultipleHeads = (pattern: Pattern[]) => {
  pattern.forEach((element, index) => {
    if (index > 0 && isHead(element)) {
      throw Error('Pattern has multiple heads in one array.');
    }
  });
};

const _matchNamedHead = (
  pattern: Pattern[],
  array: ListLike,
  placeholder: Placeholder,
  lastHeadIndex: number,
  _match: MatchFunction,
  matches: Match,
): MatchTuple => {
  _throwIfMultipleHeads(pattern);
  const [isMatch, newMatches] = _match(
    placeholder,
    array.slice(0, lastHeadIndex + 1),
    matches,
  );
  return isMatch
    ? _match(pattern.slice(1), array.slice(lastHeadIndex + 1), newMatches)
    : [false, {}];
};

const _matchTail = (
  tail: Tail,
  array: ListLike,
  accumulator: Match,
  i: number,
  _match: MatchFunction,
) => (
  isUnnamedPlaceholder(tail.bindTo)
    ? [stop, [true, accumulator]]
    : _accumulatorOrNone(..._match(tail.bindTo, array.slice(i), accumulator))
);

const matchArray = (
  pattern: Pattern,
  array: ListLike,
  arrayLen: number,
  get: ListGet,
  _match: MatchFunction,
  matches: Match,
) => {
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
    return _matchNamedHead(pattern, array, head.bindTo, lastHeadIndex, _match, matches);
  }

  const headOffset = hasHead ? lastHeadIndex : 0;

  const reducer = ({ 1: accumulator }: MatchTuple, elm: any, i: number) => {
    if (i === tailIndex && hasTail) {
      return _matchTail(tail, array, accumulator, i, _match);
    }
    if (i === 0 && hasHead) {
      return [ok, [true, accumulator]];
    }
    if (isReservedKeyword(elm)) {
      throw Error(`Reserved keyword ${elm.lookupName} used in invalid position.`);
    }
    const arrayElement = get(i + headOffset);
    return _accumulatorOrNone(..._match(elm, arrayElement, accumulator));
  };

  return reduceWhile(reducer, [true, matches], pattern);
};

export { matchArray };
