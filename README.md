![build](https://github.com/moritzploss/ex-patterns/workflows/Build/badge.svg)
![tests](https://github.com/moritzploss/ex-patterns/workflows/Tests/badge.svg)

# Ex Patterns

This project brings Elixir-style [**pattern matching**](https://elixir-lang.org/getting-started/pattern-matching.html)
and control flow structures to JavaScript. Pattern matching is supported for
native JavaScript data types as well as common [**Immutable.js**](https://immutable-js.github.io/immutable-js/)
collections. See the [**documentation**](https://moritzploss.github.io/ex-patterns/#/) for details and examples.

## Setup

Install the package from npm:

    npm i ex-patterns

## What's in the Box

### The [`match`](https://moritzploss.github.io/ex-patterns/#/?id=the-match-function) Function

A pattern matching function for flat and nested data structures, including
arrays, objects and `Immutable.js` collections:

```javascript
import { match, _, A } from 'ex-patterns';

const pattern = [_, 2];
const value   = [1, 2];
match(pattern, value)       // match

const pattern = [A, 2];
const value   = [1, 2];
match(pattern, value)       // match against placeholder A  >>  { A: 1 }
```

### The [`when`](https://moritzploss.github.io/ex-patterns/#/?id=the-when-function) Function

A switch statement based on pattern matching, similar to Elixir's [`case`](https://elixir-lang.org/getting-started/case-cond-and-if.html#case)
control flow structure. It accepts any number of match
clauses in the format `(pattern, callback)` that are matched against a value.

```javascript
import { when, end, then, _, A, H, N } from 'ex-patterns';

const sayHi = (user) => when(user)
    ({ name:    N }, then(({ N }) => `Hi ${N}!`))
    ({ alias:   A }, then(({ A }) => `Hi ${A}!`))
    ({ handle:  H }, then(({ H }) => `Hi ${H}!`))
    (_, then(() => 'Hi!'))
(end);

sayHi({ name: 'Amelie' });
> 'Hi Amelie!'
```

### The [`suppose`](https://moritzploss.github.io/ex-patterns/#/?id=the-suppose-function) Function

A control flow structure to leverage the power of pattern matching while
coding for the happy path, similar to Elixir's `with`. Takes any number of
clauses in the format `(pattern, function)` and checks if the return value of
`function` matches `pattern`. Matches are piped through the `suppose` clauses
until the `then` callback is reached. Can be combined with an optional [`otherwise`](https://github.com/moritzploss/ex-patterns#catching-errors) clause.

```javascript
import { suppose, then, otherwise, end, I, N, R } from 'ex-patterns';

const response = await ...

suppose
    ({ status: 200 }, () => response)
    ({ body: { name: N, id: I }}, () => response)
    (true, matches => isValidUserName(matches.N))
    (true, matches => isUniqueUserId(matches.I))
(then)
    (matches => `Welcome ${matches.N}`)
(end);
```

### The [`cond`](https://moritzploss.github.io/ex-patterns/#/?id=the-cond-function) Function

A compact switch statement that accepts any number of clauses in the format
`(truthy?, value)`, similar to Elixir's [`cond`](https://elixir-lang.org/getting-started/case-cond-and-if.html#cond)
control flow structure:

```javascript
import { cond, end, then } from 'ex-patterns';

const fizzBuzz = (number) => cond
    (number % 15 === 0, then('fizzbuzz'))
    (number % 3 === 0, then('fizz'))
    (number % 5 === 0, then('buzz'))
    (true, then(number))
(end);

fizzBuzz(5)
> 'buzz'
```

### Want to learn more?

Head over to the [**documentation**](https://moritzploss.github.io/ex-patterns/#/)
for a lot more details and examples!