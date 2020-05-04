import { Head, isHead, head } from './head';
import { Tail, isTail, tail } from './tail';
import { resolve } from './keyword';

const isReservedKeyword = (element: any): boolean => {
  if (isTail(element)) {
    return true;
  }
  if (isHead(element)) {
    return true;
  }
  return false;
};

export { Head, Tail, tail, head, isTail, isHead, resolve, isReservedKeyword };
