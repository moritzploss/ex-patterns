import { Map, List } from 'immutable';
import * as R from 'ramda';

export const { equals }: { equals: (value1: any, value2: any) => boolean } = R;

export const hasKey = (object: Object, key: string): boolean => (
  Object.prototype.hasOwnProperty.call(object, key)
);

export const isArray = (maybeArray: any) => Array.isArray(maybeArray);
export const isList = (maybeList: any) => List.isList(maybeList);

export const isMap = (maybeMap: any) => Map.isMap(maybeMap);
export const isObject = (maybeObject: any) => R.type(maybeObject) === 'Object';

export const isFunction = (maybeFunction: any) => typeof maybeFunction === 'function';
