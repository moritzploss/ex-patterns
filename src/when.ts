import { match } from './pattern';
import { _, end } from './symbols';

const throwArgError = () => {
  throw Error('Expected 1 (end) or 2 (type pattern, type function) arguments.');
};

const _when = (value, done = false, result = null) => (...args: [any?, Function?]) => {
  const argsLength = args.length;

  if (argsLength === 0) {
    throwArgError();
  }

  if (argsLength === 1) {
    if (args[0] === end && done) {
      return result;
    }
    if (args[0] !== end) {
      throwArgError();
    }
    throw Error('No matching clause found. ');
  }

  if (argsLength > 2) {
    throwArgError();
  }

  if (typeof args[1] !== 'function') {
    throw Error(`Expected second argument to be a function (is ${typeof args[1]}).`);
  }

  if (done) {
    return _when(value, true, result);
  }

  const [pattern, callback] = args;
  const [isMatch, matches] = match(pattern, value);
  if (isMatch) {
    return _when(value, true, callback(matches, value, pattern));
  }

  return _when(value);
};

const when = (value: any): any => _when(value);

export { when, _, end };
