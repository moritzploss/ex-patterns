import { isPlaceholder } from '../placeholders';
import { isFunction, isObject } from '../util';
import { Placeholder } from '../types';

const throwBindError = (keyword: any, placeholder: Placeholder) => {
  throw Error(`Cannot bind '${keyword}' to invalid placeholder ${placeholder}`);
};

const resolve = (maybeKeyword: any) => {
  if (isFunction(maybeKeyword)) {
    return maybeKeyword();
  }
  return maybeKeyword;
};

const isKeyword = (maybeKeyword: any, keywordName, keywordSymbol): boolean => {
  const resolved = resolve(maybeKeyword);
  if (!isObject(resolved)) {
    return false;
  }
  return resolved.symbol === keywordSymbol
    && resolved.lookupName === keywordName
    && isPlaceholder(resolved.bindTo);
};

export { resolve, isKeyword, throwBindError };
