import { List, Map } from 'immutable';

import { Match, MatchTuple, Pattern } from '../types';

export type MatchFunction = (pattern: Pattern, value: any, matches?: Match) => MatchTuple;

export interface ListLike { slice: (start?: Number, end?: Number) => ListLike }
export type ListGet = (index: number, elm?: any) => any;

export type MapLike = Object | Map<string, any>;
export type MapGet = (key: string) => any;
export type MapHas = (key: string) => boolean;
