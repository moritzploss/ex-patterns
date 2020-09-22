import { Placeholder } from '../types';

export type Head = {
  symbol: Symbol;
  lookupName: 'head';
  bindTo: Placeholder;
}

export type HeadFunction = (placeholder?: Placeholder) => Head;

export type Tail = {
  symbol: Symbol;
  lookupName: 'tail';
  bindTo: Placeholder;
}

export type TailFunction = (placeholder?: Placeholder) => Tail;

export type ReservedKeyword = Head | Tail;
