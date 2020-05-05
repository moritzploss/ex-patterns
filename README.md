![build](https://github.com/moritzploss/ex-patterns/workflows/Build/badge.svg)
![tests](https://github.com/moritzploss/ex-patterns/workflows/Tests/badge.svg)

# Ex Patterns

This project brings Elixir-style [**pattern matching**](https://elixir-lang.org/getting-started/pattern-matching.html)
and control flow structures to JavaScript. Pattern matching is supported for
native JavaScript data types as well as common [`Immutable.js`](https://immutable-js.github.io/immutable-js/)
collections. See the [**documentation**](https://github.com/moritzploss/ex-patterns/#documentation)
for details and examples.

## Setup

Install the package from npm:

    npm i ex-patterns

## What's in the Box

#### The [`match`](https://github.com/moritzploss/ex-patterns/#the-match-function) Function

A pattern matching algorithm for flat and nested data structures, including
arrays, objects and `Immutable.js` collections:

```javascript
import { match, _, A } from 'ex-patterns';

const pattern = [_, 2];
const value   = [1, 2];
match(pattern, value)       // match

const pattern = [A, 2];
const value   = [1, 2];
match(pattern, value)       // match against placeholder A  >>  A: 1
```

#### The [`when`](https://github.com/moritzploss/ex-patterns/#the-when-function) Function

A switch statement based on pattern matching similar to Elixir's [`case`](https://elixir-lang.org/getting-started/case-cond-and-if.html#case) statement. It accepts any number of
match clauses in the format `(pattern, callback)` that are matched against `value`.

```javascript
import { when, end, _, A } from 'ex-patterns';

const value = 'world'
when(value)
    ('hi', then(() => 'hi'))            // no match. 'hi' does not match 'world'!
    (A, then(({ A }) => `hello ${A}`))  // placeholder 'A' matches 'world' => invoke callback!
    (_, then(() => 'goodbye!'))         // placeholder '_' can be used as fallback
(end);

> 'hello world'
```

#### The [`cond`](https://github.com/moritzploss/ex-patterns/#the-cond-function) Function

A switch statement similar to Elixir's [`cond`](https://elixir-lang.org/getting-started/case-cond-and-if.html#cond)
statement. It accepts any number of clauses in the format
`(truthy?, value)` and works like a chain of `if {} else if {} else {}`
statements.

```javascript
import { cond, end } from 'ex-patterns';

const fizzBuzz = (number) => cond
    (number % 15 === 0, then('fizzbuzz'))
    (number % 3 === 0, then('fizz'))
    (number % 5 === 0, then('buzz'))
    (true, then(number))
(end);

fizzBuzz(5)
> 'buzz'
```

# Documentation

* [Pattern Matching Basics](https://github.com/moritzploss/ex-patterns#pattern-matching-basics)
* [The `match` Function](https://github.com/moritzploss/ex-patterns#the-match-function)
    * [Basics](https://github.com/moritzploss/ex-patterns#basics)
    * [The `_` Placeholder](https://github.com/moritzploss/ex-patterns#the-_-placeholder)
    * [Named Placeholders](https://github.com/moritzploss/ex-patterns#named-placeholders)
    * [Array-like Data Types](https://github.com/moritzploss/ex-patterns#array-like-data-types)
        * [Arrays](https://github.com/moritzploss/ex-patterns#arrays)
        * [`Immutable.js` Lists](https://github.com/moritzploss/ex-patterns#immutablejs-lists)
    * [Map-like Data Types](https://github.com/moritzploss/ex-patterns#map-like-data-types)
        * [Objects](https://github.com/moritzploss/ex-patterns#objects)
        * [`Immutable.js` Maps](https://github.com/moritzploss/ex-patterns#immutablejs-maps)
* [The `when` Function](https://github.com/moritzploss/ex-patterns/#the-when-function)
    * [Basics](https://github.com/moritzploss/ex-patterns/#basics-1)
    * [Pattern Matching](https://github.com/moritzploss/ex-patterns#pattern-matching)
    * [Callback Functions](https://github.com/moritzploss/ex-patterns#callback-functions)
* [The `cond` Function](https://github.com/moritzploss/ex-patterns/#the-cond-function)
* [Examples](https://github.com/moritzploss/ex-patterns#examples)
    * [HTTP Request Processing with `fetch`](https://github.com/moritzploss/ex-patterns#http-request-processing-with-fetch)

## Pattern Matching Basics

If you're new to pattern matching, the [**Elixir Docs**](https://elixir-lang.org/getting-started/pattern-matching.html)
contain all you need to know. In essence, pattern matching is a way of
destructuring complex (or simple) data structures and extracting the information
that you're interested in. This can result in a much cleaner and more expressive
programming style with fewer conditionals and less explicit branching logic.

In JavaScript, the equal sign is an *assignment operator*. A variable on the
left side is *assigned* the value on the right side.

```javascript
const a = 1;
const b = [1, 2, 3];
```

In contrast, **pattern matching** allows for having data structures on both
sides of the `=` sign, and to evaluate if there's a way to match them. It's
helpful to keep this idea of `left` and `right` in mind when going through the
examples below!

```javascript
a = 1  // match
1 = 1  // match
1 = a  // match
```

## The `match` Function

### Basics

To follow along with the examples, start by importing the `match` function as
well as `_` (underscore), the *unnamed placeholder*.

```javascript
import { match, _ } from 'ex-patterns';
```

The `match` function is used to evaluate whether a pattern (left) matches a
value (right). In it's simplest form, a pattern match is an equality check **by value**,
comparing the first and second argument of the `match` function. Since checks
for value equality in JavaScript aren't trivial, this package uses
[**Ramda's**](https://ramdajs.com/docs/) `equals` function to do the heavy
lifting.

```javascript
match(1, 1)                 // match
match(1, 2)                 // no match

match([1, 2], [1, 2])       // match
match([1, 2], [3, 4])       // no match
```

The return value of the `match` function is a two element tuple (array). The first
element in the tuple indicates if the match was successful, the second element
is a JavaScript object containing the match results. We'll talk more about that
later!

```javascript
match(1, 1)     // match
> [true, {}]

match(1, 2)     // no match
> [false, {}]
```

### The `_` Placeholder

In the examples above, both the pattern and the value are regular JavaScript
expressions. Things get more interesting when we introduce the
*unnamed placeholder* `_`. This placeholder can be used on the **left** side
(first argument) of a match to stand in for any value on the right:

```javascript
match([1, 2], [1, 2])       // match
match([1, _], [1, 2])       // match
match([_, _], [1, 2])       // match

match([5, _], [1, 2])       // no match
```

Note that using placeholders on the **right side** (second argument) of the `match`
function will throw an error! Thus, **placeholders can only be used in patterns, not in
values!**

In the above example, the *unnamed placeholder* was used to stand in for a single element
of an array. However, it can also be used as a placeholder for the entire array,
or any other arbitrary data structure, no matter if flat or nested:

```javascript
match(_, 1)                     // match
match(_, 'foo')                 // match
match(_, [1, 2])                // match
match(_, { a: 'b' })            // match
match({ a: _ }, { a: 'b' })     // match
```

It's also possible to use the *unnamed placeholder* multiple times in a pattern:

```javascript
match([1, _, 3, _, 5], [1, 2, 3, 4, 5])   // match
```

### Named Placeholders

As mentioned above, the first value in the return tuple of the `match` function
indicates whether the match was successful; the second value is a JavaScript
object containing successful matches against **named placeholders**. Since we
have only matched against the *unnamed placeholder* `_` so far, this object has
always been empty. Let's change that!

To start using named placeholders, import them first:

```javascript
import { match, _, A, B, C, D } from 'ex-patterns';
```

Here we import the named placeholders `A`, `B`, `C` and `D`. You can import
more placeholders as needed, all the way from `A` to `Z`. Then use them the same
way you used `_` before:

```javascript
match([1, A, 3, B, 5], [1, 2, 3, 4, 5]);   // match
> [true, { A: 2, B: 4 }]
```

If the match is successful, the second value in the return tuple contains
the values that the named placeholders were matched against! Note that you can
use the same **named** placeholder several times in a pattern
**as long as it is always matched against the same value**.

```javascript
match([D, D, D], [2, 2, 2]);   // match     >>  { D: 2 }
match([D, D, D], [1, 2, 3]);   // no match  >>  { }
```

Compare that to the *unnamed placeholder*:

```javascript
match([_, _, _], [2, 2, 2]);   // match     >>  { }
match([_, _, _], [1, 2, 3]);   // match     >>  { }
```

You can combine unnamed and named placeholders as needed, but only matches
against named placeholders are returned:

```javascript
const pattern = [_, B, B, { foo: C }];
const value   = [1, 2, 2, { foo: 'k' }];
match(pattern, value);

> [true, { B: 2, C: 'k' }]
```

### Array-like Data Types

#### Arrays

Above we have already seen the basic syntax for matching against JavaScript arrays.
Arrays are matched both based on value equality as well as on length:

```javascript
match([1, 2], [1, 2]);      // match
match([A, _], [1, 2]);      // match    >>  { A: 1 }
match([1, 2], [1, 2, 3]);   // no match
```

To only match against the first elements of an array, use the `tail` keyword.
The `tail` keyword can **only be used in the last position** of the array and
will match against any number (including 0) of array elements:

```javascript
import { match, tail, _, A, B, C, D } from 'ex-patterns';

match([1, 2, tail], [1, 2, 3, 4]);    // match
```

To bind the elements that are matched against the tail to a placeholder, pass
the placeholder as an argument to the `tail` function:

```javascript
match([1, 2, tail(A)], [1, 2, 3, 4]);    // match
> [true, { A: [3, 4] }]
```

By default, matched elements are bound to the *unnamed placeholder*. In this case
there's no need to inspect or slice the original array since the `match` function
doesn't need to care about the number of elements (or their value) that were
matched against `tail`. Thus, it's **more efficient to not bind** the `tail`
to a placeholder if you don't have to:

```javascript
const value = [1, 2, 3, 4];
match([1, 2, tail], value);       // match  >>  no need to inspect or slice [3, 4]
match([1, 2, tail(_)], value);    // match  >>  no need to inspect or slice [3, 4]
match([1, 2, tail(A)], value);    // match  >>  inspect and slice [3, 4]!
```

Similarly, you can use the `head` keyword **in the first position** to only match
against the last elements of an array:

```javascript
import { match, head, A, B, C, D } from 'ex-patterns';

match([head, 3, 4], [1, 2, 3, 4]);      // match
match([head(B), 3, 4], [1, 2, 3, 4]);   // match  >>  { B: [1, 2] }
```

The rules and limitations are equivalent to those outlined for the `tail` keyword.
Note that **using both `head` and `tail` in the same array will throw** an error
since the following is ambiguous:

```javascript
// this will throw an error
match([head, 3, 3, tail], [3, 3, 3, 3, 3]);   // what's head? what's tail?
```

However, **it's perfectly fine** to have multiple `head` and `tail` keywords
**in the same pattern**. Rules for matching against named placeholders
apply:

```javascript
const pattern = [head(A), [head, [1, 2, tail(A)]], [3, tail]];
const value   = [1, [2, [1, 2, 1]], [3, 4, 5]]
match(pattern, value);   // match
```

#### `Immutable.js` Lists

To perform a pattern match against an immutable `List`, use the same syntax as
for matches against regular JavaScript arrays:

```javascript
match([1, 2, _], List([1, 2, 3]));  // match
```

You can use the `head` and `tail` keywords in the same way as with regular arrays:

```javascript
const pattern = [1, 2, tail];
const value   = List([1, 2, 3, 4]);
match(pattern, value));             // match
```

Note that if you bind the `head` or `tail` keyword to a named placeholder, the
**matches will be returned as an immutable `List`** (not as an array). This means
that the `match` function preserves `List` and `array` data types and you don't
need to worry about inefficient slicing when using `Immutable.js` collections!

```javascript
const pattern = [1, 2, tail(A)];
const value   = List([1, 2, 3, 4]
match(pattern, value));             // match

> [true, { A: List([3, 4]) }]       // matches are returned as immutable List!
```

### Map-like Data Types

#### Objects

As mentioned, the simplest form of a pattern match is an equality comparison
by value. However, in the case of JavaScript objects (Hash Maps), a match
also counts as successful if the pattern (left) is a subset of the value (right).
This means that it's possible to only match against the object keys that are
of interest:

```javascript
match({ a: 1 }, { a: 1, b: 2 });    // match
match({}, { a: 1, b: 2 });          // match
match({ b: 1 }, { a: 1 });          // no match
```

Also note that named and unnamed placeholders can only be used to **match against object
values, not keys**. While this wouldn't be possible to begin with (since JavaScript
object keys are just strings), it's also by design and consistent with pattern
matching in Elixir:

```javascript
match({ _: 1 }, { foo: 1 });   // no match. '_' is just a string here!
match({ A: 1 }, { foo: 1 });   // no match. 'A' is just a string here!
```

#### `Immutable.js` Maps

To perform a pattern match against an immutable `Map`, use the same syntax as
for matches against regular JavaScript maps (objects):

```javascript
match({ foo: _ }, Map({ foo: 'bar' }));  // match
```

As for objects, the match will be successful as long as the pattern is a subset of
the value:

```javascript
const pattern = { foo: { bar: A } };
const value   = Map({ foo: Map({ bar: 'hello'}), baz: 'world'});
match(pattern, value);  // match

> [true, { A: 'hello']
```

When `Map` structures are used in patterns, they are matched based on value
equality just as any other data type:

```javascript
match(Map({ foo: _ }),          { foo: 'bar' });     // no match
match(Map({ foo: _ }),      Map({ foo: 'bar' }));    // no match
match(Map({ foo: 'bar' }),  Map({ foo: 'bar' }));    // match
```

If a `Map` is matched against a named placeholder, the data type is preserved:

```javascript
match({ foo: A }, { foo: Map({ bar: 1 }) });     // match
> [true, { A: Map({ bar: 1 }) }]
```

Data types are also preserved for regular JavaScript objects that are nested
inside a `Map`:

```javascript
match({ foo: A }, Map({ foo: { bar: 1 }}));     // match
> [true, { A: { bar: 1 }}]
```

## The `when` Function

### Basics

Let's be clear -- the `when` function is just that: a function. That being said,
it can be used much like the [`case`](https://elixir-lang.org/getting-started/case-cond-and-if.html#case)
control flow structure in Elixir, and the syntax will probably make more sense
if you think about it like any other control flow structure in JavaScript. In
a way, it's similar to JavaScript's `switch` statement!

Let's start by importing the `when` function together with the `then` function,
the `end` keyword and some placeholders:

```javascript
import { when, then, end, _, A, B, C, D } from 'ex-patterns';
```

A call to the `when` function marks the beginning of the control flow structure,
and calling any resulting function with `end` marks the end. Any number of
match clauses can be inserted inbetween:

```javascript
const value = 1;
when(value)                     // start `when` control flow structure with `value`
    (1, then(() => 'foo'))      // first match clause
    (2, then(() => 'bar'))      // second match clause
    (3, then(() => 'baz'))      // third match clause
(end);                          // end `when`
```

### Pattern Matching

Each match clause takes two arguments: the first is a pattern (see above) that
will be matched against `value`, the second a callback function that will be
invoked when the match is successful. It's recommend to wrap the callback function
inside `then` for readability, but it's optional (the `then` function is just
syntactic sugar).

In the following case, `value` will match the second clause; clauses that come
**after** a matching clause will not be matched against:

```javascript
const value = 2;
when(value)
    (1, then(() => 'foo'))    // no match. '1' does not match '2'
    (2, then(() => 'bar'))    // '2' matches '2' => invoke callback!
    (3, then(() => 'baz'))    // will not be matched against
(end);
```

**The `when` control flow structure returns the return value of the callback
function that belongs to the first matching clause!**

```javascript
const value = 2;
const result = when(value)
    (1, then(() => 'foo'))    // no match
    (2, then(() => 'bar'))    // '2' matches '2' => callback returns 'bar'
    (3, then(() => 'baz'))
(end);

result
> 'bar'
```

The pattern in the match clause can be arbitrarily complex and make use of the
rules and placeholders introduced above:

```javascript
const value = [1, 2, 3];
when(value)
    ([1, 1, 1], then(() => 'foo'))    // no match
    ([_, _, B], then(() => 'bar'))    // match, callback returns 'bar'
    (3, then(() => 'baz'))
(end);
```

**If no clause matches, an error will be thrown.** Thus, it's advisable to make
use of the unnamed placeholder `_` in the final clause:

```javascript
const value = 5;
when(value)
    (1, then(() => 'foo'))    // no match
    (2, then(() => 'bar'))    // no match
    (_, then(() => 'baz'))    // matches anything! callback returns 'baz'
(end);
```

### Callback Functions

When invoked, the callback functions in the match clauses are passed three arguments:

*  the match result (type `Object`)
*  the `value` that was matched against (type `any`)
*  the pattern that was used to perform the match (type `Pattern`)

For example:

```javascript
const user = { name: 'Amelie' };

when(user)
    ({ city: A }, then((...args) => args))      // no match
    ({ name: N }, then((...args) => args))      // match
    (_, then(() => 'no match!'))
(end);

> [{ N: 'Amelie' }, { name: 'Amelie' }, { name: N }]
```

This becomes very powerful when combined with object destructuring and
renaming of desctructured variables in the callback function:

```javascript
const user = { name: 'Amelie', age: 31 };

const nameAndAgeAsArray = ({ A: age, N: name }) => [name, age];

when(user)
    ({ city: 'Hamburg' }, then(() => 'foo'))          // no match
    ({ name: N, age: A }, then(nameAndAgeAsArray))    // match
    (_, then(() => 'no match!'))
(end);

> ['Amelie', 31]
```

## The `cond` Function

The `cond` function is a switch statement similar to Elixir's [`cond`](https://elixir-lang.org/getting-started/case-cond-and-if.html#cond)
statement. It accepts any number of clauses in the format `(truthy?, value)`
and works like a chain of `if {} else if {} else {}` statements:

```javascript
import { cond, end, then } from 'ex-patterns';

cond
    (false, then('no match'))
    (false, then('still no match'))
    (true, then('match'))
(end);
```

The `cond` function **returns the value** enclosed in the `then` function of the
matching clause:

```javascript
const result = cond
    (false, then('no match'))
    (false, then('still no match'))
    (true, then('match'))
(end);

result
> 'match'
```

Truthiness is evaluated **based on** JavaScript's concept of **truthy and falsy**
values:

```javascript
const result = cond
    (false, then('no match'))
    (0, then('no match'))
    (-0, then('no match'))
    ('', then('no match'))
    (null, then('no match'))
    (undefined, then('no match'))
    (NaN, then('no match'))
    (1, then('this one matches'))
(end);
```

As for the `when` function, the `cond` function **throws an error if no matching
clause** is found.


## Examples

### HTTP Request Processing with `fetch`

The fact that the `when` control flow structure returns the return value
of the invoked callback allows for expressive code when it's wrapped in a lambda
function with implicit return:

```javascript
import { when, end, then, _, E, N, } from 'ex-patterns';

const processBody = (body) => (
    when(body)
        ({ email: E, name: N }, then(({ N, E }) => ({ email: E, name: N })))
        ({ email: E }, then(({ E }) => ({ email: E, name: 'Unknown' })))
        (_, then(() => { error: 'invalid body. does not contain email.' }))
    (end);
);

const processError = (body) => (
    when(body)
        ({ error: E }, then(({ E: error }) => ({ error }))) 
        (_, then(() => ({ error: 'invalid error response. no error message.' })))
    (end);
);

const getUserData = async (url, options) => (
    when(await fetch(url, options))
        ({ status: 200 }, then((match, { body }) => processBody(body)))
        ({ status: _ }, then((match, { body }) => processError(body)))
        (_, then(() => ({ error: 'response has no status code' })))
    (end);
);
```
