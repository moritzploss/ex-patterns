import { Match, Pattern } from '../types';
import { End } from '../symbols';

export type MatchCallback = (matches?: Match, value?: any, pattern?: Pattern) => any;
export type MatchClause = (pattern: Pattern | End, callback?: MatchCallback) => any;
