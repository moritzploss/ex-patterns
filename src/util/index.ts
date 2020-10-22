import * as I from 'immutable';
import { type } from 'ramda';

export { equals } from 'ramda';

export const { isList } = I.List;
export const { isMap } = I.Map;
export const { isOrderedSet } = I.OrderedSet;
export const { isSet } = I.Set;
export const { isSeq } = I.Seq;

export const { isArray } = Array;
export const isFunction = (any: any) => typeof any === 'function';
export const isObject = (any: any) => type(any) === 'Object';

export const hasKey = (object: Object, key: string): boolean => (
  Object.prototype.hasOwnProperty.call(object, key)
);

export const isJsMap = (any: any) => {
  try {
    Map.prototype.has.call(any);
    return true;
  } catch (e) {
    return false;
  }
};
