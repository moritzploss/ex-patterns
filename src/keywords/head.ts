import { _, headSymbol } from '../symbols';
import { isPlaceholder } from '../placeholder';
import { isKeyword, throwBindError } from './keyword';
import { Head } from './types';

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
