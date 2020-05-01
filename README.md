![build](https://github.com/moritzploss/ex-patterns/workflows/Build/badge.svg)
![tests](https://github.com/moritzploss/ex-patterns/workflows/Tests/badge.svg)

# Ex Patterns

This package brings Elixir-style [**pattern matching**](https://elixir-lang.org/getting-started/pattern-matching.html)
and control flow structures to JavaScript. See the [**documentation**](https://github.com/moritzploss/ex-patterns#docs--examples) for details and examples.

## What's in the Box

The package includes a powerful pattern matching algorithm (the `match` function)
that performs pattern matching on flat or arbitrarily nested data structures:

```javascript
const pattern = [1, 2];
const value   = [1, 2];
match(pattern, value)       // match

const pattern = [_, 2];
const value   = [1, 2];
match(pattern, value)       // match

const pattern = [A, 2];
const value   = [1, 2];
match(pattern, value)       // match  >>  { A: 1 }

const pattern = [1, _];
const value   = [3, 4];
match(pattern, value)       // no match
```

The `when` control flow structure uses the `match` function to give you a `switch`
statement on steroids:

```javascript
// the value to match against
const value = [1, 2];

// callback functions that are invoked when pattern matches 'value'
const callback1 = (matches, value, pattern) => 'first clause matched!';
const callback2 = (matches, value, pattern) => 'second clause matched!';

// match 'value' against different patterns
when(value)
    ([2, 2], callback1)     // [2, 2] does not match value [1, 2]
    ([_, 2], callback2)     // [_, 2] matches value [1, 2] => invoke callback!
    (_, () => 'no match!')
(end);

> 'second clause matched!'
```

See below for a lot more details, [**documentation**](https://github.com/moritzploss/ex-patterns#docs--examples)
and examples!

## Getting Started

Install the package from npm:

    npm i ex-patterns

Or clone the git repo:

    git clone git@github.com:moritzploss/ex-patterns.git

## Docs & Examples

### Imports

To follow along with the examples, start by importing the `match` function as
well as `_` (underscore), the *unnamed placeholder*.

```javascript
import { match, _ } from 'ex-patterns';
```

### Pattern Matching Basics

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

### The `match` Function

To evaluate whether a pattern (left) matches a value (right), use the `match`
function. In it's simplest form, a pattern match is an equality check **by value**,
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
match(1, 1)    
> [true, {}]    // match

match(1, 2)    
> [false, {}]   // no match
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
more placeholders as needed, all the way from `A` to `L`. Then use them the same
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

### Matching against JavaScript Objects and Arrays

As mentioned, the simplest form of a pattern match is an equality comparison
by value. However, in the case of JavaScript objects (Hash Maps), a match
also counts as successful if the pattern (left) is a subset of the value (right):

```javascript
match({ a: 1 }, { a: 1, b: 2 });    // match
match({}, { a: 1, b: 2 });          // match
match({ a: 1, b: 2 }, { a: 1 });    // no match
```

This means that it's possible to only match against the object keys that are
of interest. Note that the same is **not** true for arrays:

```javascript
match([1, 2], [1, 2, 3]);   // no match
```

Also note that named and unnamed placeholders can only be used to **match against object
values, not keys**. While this wouldn't be possible to begin with (since JavaScript
object keys are just strings), it's also by design and consistent with pattern
matching in Elixir:

```javascript
match({ _: 1 }, { foo: 1 });   // no match. '_' is just a string here!
match({ A: 1 }, { foo: 1 });   // no match. 'A' is just a string here!
```

## The `when` Control Flow Structure

### Basic Usage

Let's be clear -- the `when` function is just that: a function. That being said,
it can be used much like the [`case`](https://elixir-lang.org/getting-started/case-cond-and-if.html#case)
control flow structure in Elixir, and the syntax will probably make more sense
if you think about it like any other control flow structure in JavaScript. In
a way, it's similar to JavaScript's `switch` statement!

Let's start by importing the `when` function together with the `end` keyword
and some placeholders:

```javascript
import { when, end, _, A, B, C, D} from 'ex-patterns';
```

A call to the `when` function marks the beginning of the control flow structure,
and calling any resulting function with `end` marks the end. Any number of
match clauses can be inserted inbetween:

```javascript
const value = 1;
when(value)             // start `when` control flow structure with `value`
    (1, () => 'foo')    // first match clause
    (2, () => 'bar')    // second match clause
    (3, () => 'baz')    // third match clause
(end);                  // end `when`
```

### Pattern Matching

Each match clause takes two arguments: the first is a pattern (see above) that
will be matched against `value`, the second a callback function that will be
invoked when the match is successful. In the following case, `value` will
match the second clause; clauses that come **after** a matching clause will
not be matched against:

```javascript
const value = 2;
when(value)
    (1, () => 'foo')    // no match. '1' does not macth '2'
    (2, () => 'bar')    // '2' matches '2' => invoke callback!
    (3, () => 'baz')    // will not be matched against
(end);
```

**The `when` control flow structure returns the return value of the callback
function that belongs to the first matching clause!**

```javascript
const value = 2;
const result = when(value)
    (1, () => 'foo')    // no match
    (2, () => 'bar')    // '2' matches '2' => callback returns 'bar'
    (3, () => 'baz')
(end);

result
> 'bar'
```

The pattern in the match clause can be arbitrarily complex and make use of the
rules and placeholders introduced above:

```javascript
const value = [1, 2, 3];
when(value)
    ([1, 1, 1], () => 'foo')    // no match
    ([_, _, B], () => 'bar')    // match, callback returns 'bar'
    (3, () => 'baz')
(end);
```

**If no clause matches, an error will be thrown.** Thus, it's advisable to make
use of the unnamed placeholder `_` in the final clause:

```javascript
const value = 5;
when(value)
    (1, () => 'foo')    // no match
    (2, () => 'bar')    // no match
    (_, () => 'baz')    // match, callback returns 'baz'
(end);
```

### Callback functions

When invoked, the callback functions in the match clauses are passed three arguments:

*  the match result (type `Object`)
*  the `value` that was matched against (type `any`)
*  the pattern that was used for the match (type `Pattern`)

For readability, it can make sense to define the callback functions outside
of the `when` structure. For example:

```javascript
const user = { name: 'Amelie', age: 31 };

const returnCallbackArgs = (matches, val, pattern) => [matches, val, pattern];

when(value)
    ({ city: 'Stockholm' }, returnCallbackArgs)  // no match
    ({ name: B, age: A }, returnCallbackArgs)    // match
    (_, () => 'no match')
(end);

> [{ A: 31, B: 'Amelie' }, { name: 'Amelie', age: 31 }, { name: B, age: A }]
```

This becomes very powerful when combined with object destructuring and
renaming of desctructured variables in the callback function:

```javascript
const user = { name: 'Amelie', age: 31 };

const returnCallbackArgs = (matches, val, pattern) => [matches, val, pattern];
const returnNameAndAge = ({ A: age, B: name }) => [name, age];

when(value)
    ({ city: 'Stockholm' }, returnCallbackArgs)  // no match
    ({ name: B, age: A }, returnNameAndAge)      // match
    (_, () => 'no match')
(end);

> ['Amelie', 31]
```

### `if` vs `switch` vs `when`

The fact that the `when` control flow structure returns the return value
of the invoked callback allows for clean and expressive code when combined
with lamda functions:

```javascript
const user = {
    name: 'David',
    age: 31,
    city: 'Stockholm',
    country: 'Sweden',
};

const processGothenburgUser = ({ A: age }) => `user is ${age} years old!`
const processStockholmUser = ({ B: name }) => `user name is ${name}!`
const processSwedishUser = ({ C: city }) => `user lives in ${city}!`
const processForeignUser = ({ C: country }) => `user is from ${country}!`

const processUser = (user) => (
    when(user)
        ({ city: 'Gothenburg', age: A }, processGothenburgUser)
        ({ city: 'Stockholm', name: B }, processStockholmUser)
        ({ country: 'Sweden', city: C }, processSwedishUser)
        ({ country: C }, processForeignUser)
    (end)
);

processUser(user);
> 'user name is David!'
```

It can take a while to get used to this style of programming, but once you have,
you may end up asking yourself why you'll ever want to use `if` or `switch`
anyway!
