import { tailSymbol, _ } from '../symbols';
import { Placeholder, isPlaceholder } from '../placeholder';
import { isKeyword, throwBindError } from './keyword';

export type Tail = {
  symbol: Symbol;
  name: 'tail';
  bindTo: Placeholder;
}

export type TailFunction = (placeholder?: Placeholder) => Tail;

const tail = (placeholder = _): Tail => {
  if (!isPlaceholder(placeholder)) {
    throwBindError('tail', placeholder);
  }
  return {
    symbol: tailSymbol,
    name: 'tail',
    bindTo: placeholder,
  };
};

const isTail = (maybeTail: any): boolean => isKeyword(maybeTail, 'tail', tailSymbol);

export { tail, isTail };
