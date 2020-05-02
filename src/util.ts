import * as R from 'ramda';

export const { equals }: { equals: (value1: any, value2: any) => boolean } = R;

export const hasKey = (object: Object, key: string) => (
  Object.prototype.hasOwnProperty.call(object, key)
);

export const isArray = (value: any) => Array.isArray(value);
export const isObject = (value: any) => typeof value === 'object' && value !== null;
export const isFunction = (value: any) => typeof value === 'function';
