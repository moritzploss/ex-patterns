import { _, headSymbol } from '../symbols';
import { Placeholder, isPlaceholder } from '../placeholder';
import { isKeyword, throwBindError } from './keyword';

export type Head = {
  symbol: Symbol;
  lookupName: 'head';
  bindTo: Placeholder;
}

export type HeadFunction = (placeholder?: Placeholder) => Head;

const head = (placeholder = _): Head => {
  if (!isPlaceholder(placeholder)) {
    throwBindError('head', placeholder);
  }
  return {
    symbol: headSymbol,
    lookupName: 'head',
    bindTo: placeholder,
  };
};

const isHead = (maybeHead: any): boolean => isKeyword(maybeHead, 'head', headSymbol);

export { head, isHead };
