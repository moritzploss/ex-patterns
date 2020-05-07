import { end, unless } from '../symbols';
import { isFunction } from '../util';

const _catch = (pattern, func) => {};


const _given = (pattern, func, done = false, result = {}) => (
  (pattern, func) => {
    if (pattern === end) {
      if (done) {
        return result;
      }
      throw Error('No matching clause found. ');
    }

    if (!isFunction(func)) {
      throw Error('Expected 1 or 2 arguments of type (end) or (unless) or (pattern, function).');
    }

    if (done) {
      return _given(pattern, func, true, result);
    }

    if (pattern === unless) {
      if (done) {
        return result;
      }
      throw Error('No matching clause found. ');
    }


    const [isMatch, matches] = match(pattern, value);
    if (isMatch) {
      return _given(value, true, callback(matches, value, pattern));
    }

    return _catch(pattern, func);
  }
);

function given(pattern, func) {
  return _given(pattern, func);
}

export { given };
