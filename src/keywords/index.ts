import { isHead, head } from './head';
import { isTail, tail } from './tail';
import { resolve } from './keyword';
import { Head, Tail } from './types';

const isReservedKeyword = (element: any): boolean => (
  isTail(element) || isHead(element)
);

export { Head, Tail, tail, head, isTail, isHead, resolve, isReservedKeyword };
