import { ok, stop } from '../util/enum';
import { Match } from '../types';

export const isMatchOrBreak = (isMatch: boolean, acc: Match) => (
  isMatch
    ? [ok, [true, acc]]
    : [stop, [false, {}]]
);
