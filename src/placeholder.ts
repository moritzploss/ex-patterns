import { reduceWhile, ok, stop } from './enum';
import { _, A, B, C, D, E, F, G, placeholders } from './symbols';

type placeholder = Symbol;

const isPlaceHolder = (pattern: any): boolean => {
  if (!(typeof pattern === 'symbol')) {
    return false;
  }
  return reduceWhile(placeholders, false, (acc, placeholder: placeholder) => {
    if (pattern === placeholder) {
      return [stop, true];
    }
    return [ok, false];
  });
};

export { isPlaceHolder, _, A, B, C, D, E, F, G };
