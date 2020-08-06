export type Match = Record<string, any>;
export type MatchTuple = [boolean, Match];
export type Pattern = any;
export interface Placeholder { lookupName: string; symbol: Symbol }
