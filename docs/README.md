![build](https://github.com/moritzploss/ex-patterns/workflows/Build/badge.svg)
![tests](https://github.com/moritzploss/ex-patterns/workflows/Tests/badge.svg)

# Ex Patterns Documentation

This project brings Elixir-style [**pattern matching**](https://elixir-lang.org/getting-started/pattern-matching.html)
and control flow structures to JavaScript. Pattern matching is supported for
native JavaScript data types as well as common [**Immutable.js**](https://immutable-js.github.io/immutable-js/)
collections.

# Introduction

## Setup

Install the package from npm:

    npm i ex-patterns

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
b = [1, 2, 3]  // match
[1, 2, 3] = b  // match
[1, _, _] = b  // match
```

## Why this Library?

It's not surprising that `ex-patterns` isn't the only pattern matching library
in the JavaScript universe; however, it can do a couple of things that others have
problems with.

Firstly, the pattern matching algorithm does not rely on function reflection. 
This means that **it works out of the box** in `es5` environments, `strict mode`
or when your code is compiled from `TypeScript`. More importantly, this also means that **it's possible to match against any
variable in the lexical environment**. If you're coming from Elixir, this is
equivalent to pattern matching against *pinned variables*:

```javascript
const homeTown = 'Stockholm';
const value = { city: 'Stockholm' };

when(value)
    ({ city: 'Stockholm' }, then(() => 'many libraries can do this!'))
    ({ city: homeTown }, then(() => 'this is not supported by some!'))
    (_, then(() => 'many libraries can do this!'))
(end);
```

In other words, *patterns* are just plain old JavaScript data structures that
(can) contain special placeholders. Because of that, **patterns are composable**
and can be combined, nested, modified and re-used in all kinds of ways (you
can even do something called [*parent capturing*](https://moritzploss.github.io/ex-patterns/#/?id=parent-capturing),
which is not widely supported in other libraries):

```javascript
const user = { name: 'Amelie', city: 'Stockholm' };

const cityPattern = { city: C };
const namePattern = { name: N };
const composedPattern = { ...cityPattern, ...namePattern };

when(user)
    (composedPattern, then(() => 'has city and name!'))
    (cityPattern, then(() => 'has only city!'))
    (namePattern, then(() => 'has only name!'))
    (_, then(() => 'has no city and no name!'))
(end);
```

While pattern matching in JavaScript is great, there are some **problems related to JavaScript's mutable data types**. For example, if you want to match
against the tail of an array and return the corresponding elements (in th example below we bind it to the placeholder `A`), there's no
way around slicing the array and copying the data:

```javascript
const value = [1, 2, 3, 4, 5];

when(value)
    ([1, 2, 3, tail], then(() => 'unbound tail! no need to slice 🙂'))
    ([_, _, tail(A)], then(({ A }) => 'bound tail! need to slice 🙁'))
    (_, then(() => 'always matches!'))
(end);
```

To avoid the performance penalties that come with copying data, copies are only created when it's absolutely necessary. Moreover, the package comes with **first class support
for Immutable.js collections**, which means that you can simply match against
immutable `List` and `Map` structures as if they were regular JavaScript
arrays and objects!

Finally, `ex-patterns` does not only come with a powerful pattern matching algorithm, but a whole array of **control flow structures that can change the way you think about programming** in JavaScript. Have fun!

# The *match* Function

## Basics

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
match(1, 1);                 // match
match(1, 2);                 // no match

match([1, 2], [1, 2]);       // match
match([1, 2], [3, 4]);       // no match
```

The return value of the `match` function is a two element tuple (array). The first
element in the tuple indicates if the match was successful, the second element
is a JavaScript object containing the match results. We'll talk more about that
later!

```javascript
match(1, 1);     // match
> [true, {}]

match(1, 2);     // no match
> [false, {}]
```

If you're only interested in whether the match was successful, there's also an
`isMatch` function that takes the same arguments as `match` and returns a
boolean:

```javascript
isMatch(1, 1);     // match
> true
```

## The *_* Placeholder

In the examples above, both the pattern and the value are regular JavaScript
expressions. Things get more interesting when we introduce the
*unnamed placeholder* `_`. This placeholder can be used on the **left** side
(first argument) of a match to stand in for any value on the right:

```javascript
match([1, 2], [1, 2]);       // match
match([1, _], [1, 2]);       // match
match([_, _], [1, 2]);       // match

match([5, _], [1, 2]);       // no match
```

Note that using placeholders on the **right side** (second argument) of the `match`
function will throw an error! Thus, **placeholders can only be used in patterns, not in
values!**

In the above example, the *unnamed placeholder* was used to stand in for a single element
of an array. However, it can also be used as a placeholder for the entire array,
or any other arbitrary data structure, no matter if flat or nested:

```javascript
match(_, 1);                     // match
match(_, 'foo');                 // match
match(_, [1, 2]);                // match
match(_, { a: 'b' });            // match
match({ a: _ }, { a: 'b' });     // match
```

It's also possible to use the *unnamed placeholder* multiple times in a pattern:

```javascript
match([1, _, 3, _, 5], [1, 2, 3, 4, 5]);   // match
```

## Named Placeholders

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

## Array-like Data Types

### Arrays {docsify-ignore}

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

const value = [1, 2, 3, 4];
match([head, 3, 4], value);      // match
match([head(B), 3, 4], value);   // match  >>  { B: [1, 2] }
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
const value   = [1,       [2,    [1, 2, 1      ]], [3, 4, 5]];
match(pattern, value);   // match
```

### Immutable.js Lists {docsify-ignore}

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
that the `match` function preserves `List` and `Array` data types and you don't
need to worry about inefficient slicing when using `Immutable.js` collections!

```javascript
const pattern = [1, 2, tail(A)];
const value   = List([1, 2, 3, 4];
match(pattern, value));             // match

> [true, { A: List([3, 4]) }]       // matches are returned as immutable List!
```

## Map-like Data Types

### Objects {docsify-ignore}

As mentioned, the simplest form of a pattern match is an equality comparison
by value. However, in the case of JavaScript objects (Hash Maps), a match
also counts as successful if the pattern (left) is a subset of the value (right).
This means that it's possible to only match against the object keys that are
of interest:

```javascript
const value = { a: 1, b: 2 };
match({ a: 1 }, value);         // match
match({}, value);               // match
match({ b: 1 }, value);         // no match
```

Also note that named and unnamed placeholders can only be used to **match against object
values, not keys**. While this wouldn't be possible to begin with (since JavaScript
object keys are just strings), it's also by design and consistent with pattern
matching in Elixir:

```javascript
match({ _: 1 }, { foo: 1 });   // no match. '_' is just a string here!
match({ A: 1 }, { foo: 1 });   // no match. 'A' is just a string here!
```

### Immutable.js Maps {docsify-ignore}

To perform a pattern match against an immutable `Map`, use the same syntax as
for matches against regular JavaScript maps (objects):

```javascript
match({ foo: _ }, Map({ foo: 'bar' }));  // match
```

As for objects, the match will be successful as long as the pattern is a subset of
the value:

```javascript
const pattern = { foo: { bar: A }};
const value   = Map({ foo: Map({ bar: 'hello'}), baz: 'world'});
match(pattern, value);  // match

> [true, { A: 'hello' }]
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
match({ foo: A }, Map({ foo: { bar: 1 } }));     // match
> [true, { A: { bar: 1 }}]
```

## Parent Capturing

Above we have seen that it's possible to match against nested data structures
with named and unnamed placeholders, and to perform partial matches against
list- and map-like data structures. This is nice when you're only interested in
specific fields of a data structure, but can cause some headaches
**when you're interested in specific fields *and* the entire data structure**
at the same time. For example:

```javascript
const value = [1, 2, 3];

// Option 1: match against elements but loose reference to array
match([A, B, C], value);

// Option 2: match against array but loose ability to match against elements
match(V, value);
```

To access specific fields and capture the entire data structure as a whole, use
**parent capturing**. This is done by passing the subpattern that you want
to match against as an argument to a **named placeholder** (parent capturing
is not supported for the *unnamed placeholder* `_` since it's non-capturing
by definition):

```javascript
// Option 3: capture entire structure as 'V', and elements as 'A', 'B', 'C'
const pattern = V([A, B, C]);
const value   = [1, 2, 3];

match(pattern, value);
> [true, { V: [1, 2, 3], A: 1, B: 2, C: 3 }]
```

From the above it may not be entirely obvious why you'd ever need parent
capturing, but imagine the following API call that returns a deeply nested
respone object (for more information on how to use the `when` function, see
below). Here you can't pattern match against the response status *and* get
access to the response as a whole since the response object was never assigned
to a variable to begin with:

```javascript
import { when, then, R, S } from 'ex-patterns';

when(await fetch('api/user/123'))
    ({ status: 200 }, then(() => 'Status is 200, but cannot access response!'))
    ({ status: S }, then(({ S }) => `Status is ${S}, but cannot access response!`))
    (R, then(({ R }) => `No status found! Here's the response: ${R}`))
(end);
```

Enter parent capturing:

```javascript
when(await fetch('api/user/123'))
    (R({ status: 200 }), then(({ R }) => `Status is 200, here's the response: ${R}`))
    (R({ status: S }), then(({ R, S }) => `Status is ${S}, here's the response: ${R}`))
    (R, then(({ R }) => `No status found! Here's the response: ${R}`))
(end);
```

As with all other patterns, **it's perfectly fine to use parent capturing
multiple times in the same pattern** as long as the same named placeholder is
always matched against the same value (I can't come up with a practical
example where this would be useful, but it's good to know that the sky is the
limit `¯\_(ツ)_/¯`):

```javascript
const names = { nickname: 'Ami', name: 'Amelie' };
const value = [{ user: names }, { user: names }];

const pattern = [B, B({ user: U({ nickname: N }) })];

match(pattern, value)   // match
```

# The *when* Function

## Basics

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
const value = 2;
when(value)                     // start `when` control flow structure with `value`
    (1, then(() => 'foo'))      // first match clause
    (2, then(() => 'bar'))      // second match clause
    (3, then(() => 'baz'))      // third match clause
(end);                          // end `when`
```

## Pattern Matching

Each match clause takes two arguments: the first is a pattern (see above) that
will be matched against `value`, the second a callback function that will be
invoked when the match is successful. It's recommend to wrap the callback function
inside **`then` for readability, but it's optional** (the `then` function is just
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

## Callback Functions

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

const nameAndAge = ({ N: name, A: age }) => [name, age];

when(user)
    ({ city: 'Hamburg' }, then(() => 'foo'))   // no match
    ({ name: N, age: A }, then(nameAndAge))    // match
    (_, then(() => 'no match!'))
(end);

> ['Amelie', 31]
```

# The *suppose* Function

## Basics

The `suppose` function is a control flow structure that **performs a series of
pattern matches** before executing the final `then` callback. The function takes
any amount of `suppose` clauses in the format `(pattern, function)` and **proceeds
from top to bottom** as long as all matches succeed.

```javascript
import { suppose, then, end, A, B, C, D, _ } from 'ex-patterns';

suppose
    (A, () => 1)    // A matches 1, go to next line
    (B, () => 2)    // B matches 2, go to next line
    (C, () => 3)    // C matches 3, execute 'then' callback
(then)
    (() => 'all clauses matched!'))
(end);
```

**Matches** against named placeholders **are piped along** and can be accessed in all
`suppose` clauses and the `then` callback:

```javascript
import { suppose, then, end, A, B, C, _ } from 'ex-patterns';

suppose
    (A, () => 1)
    (B, matches => matches.A + 1)
    (C, matches => matches.B + 1)
(then)
    (matches => [matches.A, matches.B, matches.C])
(end);

```

If all clauses match, the control flow structure **returns the return value of
the `then` callback**:

```javascript
import { suppose, then, end, A, B, C, _ } from 'ex-patterns';

const result = suppose
    (A, () => 1)
    (B, matches => matches.A + 1)
    (C, matches => matches.B + 1)
(then)
    (matches => [matches.A, matches.B, matches.C])
(end);

result
> [1, 2, 3]
```

## Catching Errors

**If** any of the `suppose` clauses returns a **value that does not match**
the pattern specified in the clause, an **error is thrown**. To avoid
the error, any number of `otherwise` clauses in the format `(pattern, callback)`
can be inserted before `end`. The **patterns are matched against the value**,
and the callback that belongs to the first matching pattern will be executed:

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
(end);

> "I caught it! It's 4"
```

Thus, you can think of the `otherwise` clause as a `when` function that takes
the first non-matching function return as an argument (that's exactly
how it is implemented by the way!). While this is a great way to get your program
back on the happy path, runtime errors will still be raised and the `suppose`
function makes no attempt to catch them. Therefore, it's good practice to carefully
think about the non-matching patterns that you might encounter in your `suppose`
clauses and to write an `otherwise` clause for each one of them!

## Callback Functions

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
(end);
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
(end);
```

# The *cond* Function

The `cond` function is a switch statement similar to Elixir's [`cond`](https://elixir-lang.org/getting-started/case-cond-and-if.html#cond)
statement. It accepts any number of clauses in the format `(truthy?, value)`
and works like a chain of `if {} else if {} else {}` statements:

```javascript
import { cond, end, then } from 'ex-patterns';

cond
    (false, then('not truthy'))
    (false, then('still not truthy'))
    (true, then('truthy'))
(end);
```

The `cond` function **returns the value** enclosed in the `then` function of the
first truthy clause:

```javascript
const result = cond
    (false, then('not truthy'))
    (false, then('still not truthy'))
    (true, then('truthy'))
(end);

result
> 'truthy'
```

Clauses are evaluated **based on** JavaScript's concept of **truthy and falsy**
values:

```javascript
cond
    (false, then('not truthy'))
    (0, then('not truthy'))
    (-0, then('not truthy'))
    ('', then('not truthy'))
    (null, then('not truthy'))
    (undefined, then('not truthy'))
    (NaN, then('not truthy'))
    (1, then('this one is truthy'))   // truthy
(end);
```

As for the `when` function, the `cond` function **throws an error if no truthy
clause** is found. Similarly, it's optional to wrap the return value in the `then`
function, but recommended for readability.

# Examples

## Redux Reducer

This example shows how to use the `when` function to build a simple [Redux](https://redux.js.org/) 
reducer that updates the displayed page (`view`) and user data (`user`) of an
app based on the type of incoming reducer actions.

```javascript
import { when, end, _, U, T } from 'ex-patterns';

const appStateReducer = (appState = initialState, action) => when(action)
    ({ type: 'LOG IN', user: U }, ({ U }) => ({ ...appState, user: U, view: 'HOME' }))
    ({ type: 'GO TO',  view: T }, ({ T }) => ({ ...appState, view: T }))
    ({ type: 'LOG OUT' }, () => initialState)
    (_, () => appState)
(end);
```