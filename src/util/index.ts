import { Map, List, Set, OrderedSet, Seq } from 'immutable';
import * as R from 'ramda';

export const { equals } = R;

export const hasKey = (object: Object, key: string): boolean => (
  Object.prototype.hasOwnProperty.call(object, key)
);

export const isArray = (maybeArray: any) => Array.isArray(maybeArray);
export const isFunction = (maybeFunction: any) => typeof maybeFunction === 'function';
export const isList = (maybeList: any) => List.isList(maybeList);
export const isMap = (maybeMap: any) => Map.isMap(maybeMap);
export const isObject = (maybeObject: any) => R.type(maybeObject) === 'Object';
export const isOrderedSet = (maybeOrderedSet: any) => OrderedSet.isOrderedSet(maybeOrderedSet);
export const isSet = (maybeSet: any) => Set.isSet(maybeSet);
export const isSeq = (maybeSeq: any) => Seq.isSeq(maybeSeq);
