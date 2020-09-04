import { tailSymbol, _ } from '../symbols';
import { isPlaceholder } from '../placeholders';
import { isKeyword, throwBindError } from './keyword';
import { Tail } from './types';

const tail = (placeholder = _): Tail => {
  if (!isPlaceholder(placeholder)) {
    throwBindError('tail', placeholder);
  }
  return {
    symbol: tailSymbol,
    lookupName: 'tail',
    bindTo: placeholder,
  };
};

const isTail = (maybeTail: any): boolean => isKeyword(maybeTail, 'tail', tailSymbol);

export { tail, isTail };
