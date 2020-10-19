import * as I from 'immutable';
import * as R from 'ramda';

export const { equals } = R;

export const hasKey = (object: Object, key: string): boolean => (
  Object.prototype.hasOwnProperty.call(object, key)
);

export const isArray = (maybeArray: any) => Array.isArray(maybeArray);
export const isFunction = (maybeFunction: any) => typeof maybeFunction === 'function';
export const isObject = (maybeObject: any) => R.type(maybeObject) === 'Object';

export const isJsMap = (maybeMap: any) => {
  try {
    Map.prototype.has.call(maybeMap);
    return true;
  } catch (e) {
    return false;
  }
};

export const isList = (maybeList: any) => I.List.isList(maybeList);
export const isMap = (maybeMap: any) => I.Map.isMap(maybeMap);
export const isOrderedSet = (maybeOrderedSet: any) => I.OrderedSet.isOrderedSet(maybeOrderedSet);
export const isSet = (maybeSet: any) => I.Set.isSet(maybeSet);
export const isSeq = (maybeSeq: any) => I.Seq.isSeq(maybeSeq);
