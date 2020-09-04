import { end, otherwise } from '../symbols';
import { isFunction } from '../util';
import { _match } from '../patterns/matchInternal';
import { isThen } from './then';
import { when } from './when';
import { Match, Pattern } from '../types';

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

/**
A control flow structure that performs a series of pattern matches before
executing the final `then` callback. The function takes any amount of `suppose`
clauses in the format `(pattern, func)` and proceeds from top to bottom as long
as all matches succeed.

@param pattern: A pattern that will be matched against the return value of `func`
@param func: A function that will be invoked with the piped matches as the first argument

@returns Chainable control flow structure. See examples.

@example

```javascript
import { suppose, then, end, A, B, C, D, _ } from 'ex-patterns';

suppose
    (A, () => 1)    // A matches 1, go to next line
    (B, () => 2)    // B matches 2, go to next line
    (C, () => 3)    // C matches 3, execute 'then' callback
(then)
    (() => 'all clauses matched!'))
(end)
```

Matches against named placeholders are piped along and can be accessed in all
`suppose` clauses and the `then` callback:

```javascript
import { suppose, then, end, A, B, C, _ } from 'ex-patterns';

suppose
    (A, () => 1)
    (B, matches => matches.A + 1)
    (C, matches => matches.B + 1)
(then)
    (matches => [matches.A, matches.B, matches.C])
(end)

```

If all clauses match, the control flow structure returns the return value of
the `then` callback:

```javascript
import { suppose, then, end, A, B, C, _ } from 'ex-patterns';

const result = suppose
    (A, () => 1)
    (B, matches => matches.A + 1)
    (C, matches => matches.B + 1)
(then)
    (matches => [matches.A, matches.B, matches.C])
(end)

result
> [1, 2, 3]
```

### Catching Errors

If any of the `suppose` clauses returns an unexpected value that does not match
the pattern specified in the clause, an error is thrown. To avoid
the error, any number of `otherwise` clauses in the format `(pattern, callback)`
can be inserted before `end`. The patterns are matched against the
unexpected value, and the callback that belongs to the first matching pattern
will be executed:

```javascript
import { suppose, then, end, A, B, C, _ } from 'ex-patterns';

suppose
    (1, () => 1)
    (2, () => 2)
    (3, () => 4)    // value '4' does not match pattern '3'
(then)
    (matches => 'all clauses matched!')
(otherwise)
    (7, matches => 'I only catch 7s!')
    (A, matches => `I caught it! It's ${matches.A}`)  // 'A' matches value '4'
    (_, () => 'pff! I would have caught it anyway!')
(end)

> "I caught it! It's 4"
```

Thus, you can think of the `otherwise` clause as a `when` function that takes
the unexpected value as an argument (in fact, that's excatly how it is
implemented!). Note though that while this is a great way to get you back on
track when you unexpectedly left the happy path, runtime errors will still be
raised and the `suppose` function makes no attempt to catch them. Thus, it's
good practice to carefully think about the error patterns that you might
encounter and to write an `otherwise` clause for each one of them!

### Callback Functions

The functions in the `suppose` clauses are passed the piped matches as their
only argument. The same is true for the `then` callback.

```javascript
import { suppose, then, end, A, B, C, _ } from 'ex-patterns';

suppose                     // function arguments:
    (A, () => 1)            // {}
    (B, matches => 1)       // { A: 1 }
    (C, matches => 1)       // { A: 1, B: 1 }
(then)
    (matches => 'foo')      // { A: 1, B: 1, C: 1 }
(end)
```

The match callbacks in the `otherwise` clauses are passed the same arguments as
the callbacks of the `when` function.

```javascript
import { suppose, then, end, A, B, C, _ } from 'ex-patterns';

suppose
    (A, () => 1)
    (2, matches => 'baz')       // no match
    (C, matches => 1)
(then)
    (matches => 'foo')
(otherwise)                                             // function arguments:
    (D, (matches, unmatchedValue, pattern)  => 'hi')    // { D: 'baz' }, 'baz', D
    (_, (matches, unmatchedValue, pattern)  => 'hi')    // {}, 'baz', _
(end)
```
 */
function suppose(pattern: Pattern, func: any): any {
  return _suppose()(pattern, func);
}

export { suppose };
