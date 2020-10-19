import * as I from 'immutable';

import { Match, MatchTuple, Pattern } from '../types';

export type MatchFunction = (pattern: Pattern, value: any, matches?: Match) => MatchTuple;

export interface ListLike<T> { slice: (start?: Number, end?: Number) => ListLike<T> }
export type ListGet = (index: number, elm?: any) => any;

export type MapLike<T, K> = Map<T, K> | I.Map<T, K>;
export type MapGet = (key: string) => any;
export type MapHas = (key: string) => boolean;
