import { end, End, A, B, C, D, _ } from '../symbols';
import { when } from './when';

const _given = (pattern, func) => {};

function given(pattern: any, func: any) {
  return _given(pattern, func);
}

export { given };
