import { end, otherwise } from '../symbols';
import { isFunction } from '../util';
import { _match } from '../pattern';
import { isThen } from './then';
import { when } from './when';
import { Pattern } from '../pattern/types';
import { Match } from '../match';

const thenCallback = (matches: Match, supposeFunc: Function) => (callback: Function): any => {
  if (!isFunction(callback)) {
    throw Error('Expected a function in \'then\' callback.');
  }
  return supposeFunc(true, matches, callback(matches), true);
};

const _suppose = (happy = true, matches = {}, result = null, hasResult = false): Function => (
  (pattern: Pattern, func: any): any => {
    // if called with 'end', return result
    if (pattern === end) {
      if (hasResult) {
        return result;
      }
      throw Error('No matching clause found.');
    }

    // if a 'suppose' clause has not matched
    if (!happy) {
      // enter 'otherwise' clause
      if (pattern === otherwise) {
        return when(result);
      }

      // skip over 'then' clause until 'otherwise' clause is reached
      return _suppose(false, {}, result);
    }

    // if all 'suppose' and 'then' clauses have been called and all is good,
    // just keep calling _suppose until it's called with 'end'
    if (hasResult) {
      return _suppose(true, matches, result, true);
    }

    // if function has been called with 'then'
    if (isThen(pattern)) {
      return thenCallback(matches, _suppose);
    }

    // check if second argument in 'suppose' clause is a function
    if (!isFunction(func)) {
      throw Error('Expected 1 or 2 arguments of type (then) or (pattern, function).');
    }

    // check if function result in 'suppose' clause matches pattern
    const funcResult = func(matches);
    const [isMatch, newMatches] = _match(pattern, funcResult, matches);

    return isMatch
      ? _suppose(true, newMatches)
      : _suppose(false, {}, funcResult);
  }
);

function suppose(pattern: Pattern, startValue: any): any {
  if (isFunction(startValue)) {
    throw Error('Start value in \'suppose\' statement cannnot be a function.');
  }
  return _suppose()(pattern, () => startValue);
}

export { suppose };
