import { Match } from '../../types';

import { ok, stop } from '../../util/enum';

export const isMatchOrBreak = (isMatch: boolean, acc: Match) => (
  isMatch
    ? [ok, [true, acc]]
    : [stop, [false, {}]]
);
