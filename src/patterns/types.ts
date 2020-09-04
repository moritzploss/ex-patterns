import { List, Map } from 'immutable';

import { Match, MatchTuple, Pattern } from '../types';

export type MatchFunction = (pattern: Pattern, value: any, matches?: Match) => MatchTuple;

export type ListLike = [] | List<any>;
export type ListGet = (index: number) => any;

export type MapLike = Object | Map<string, any>;
export type MapGet = (key: string) => any;
export type MapHas = (key: string) => boolean;
