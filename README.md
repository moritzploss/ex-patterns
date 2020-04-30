![build](https://github.com/moritzploss/ex-patterns/workflows/Build/badge.svg)
![tests](https://github.com/moritzploss/ex-patterns/workflows/Tests/badge.svg)

# Ex Patterns

This package brings Elixir-style [**pattern matching**](https://elixir-lang.org/getting-started/pattern-matching.html)
and control flow structures to JavaScript.

## What's in the Box

A powerful pattern matching algorithm (the `match` function) that really shines
when used together with the `when` control flow. Start by reading the section on
pattern matching below, then move on to the `when` function.

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
that you're interested in. This can result in a much cleaner and expressive programming style with fewer conditionals and less explicit branching logic.

In JavaScript, the equal sign is the assignment operator. Therefore,
a variable on the left side can be *assigned* any value on the right side.

```javascript
const a = 1;
const b = [1, 2, 3];
```

Note that we always have a variable name on the left side of the assignment
operator, and a data structure on the right side. In contrast, **pattern
matching** allows us to have data structures on both sides of the `=` sign,
and to evaluate if both sides can be made to match each other. Keep this
idea of `left` and `right` in mind when going through the examples below!

### The `match` Function

To evaluate whether a pattern (left) matches a value (right), use the `match`
function:

```javascript
match(1, 1)                 // match
match(1, 2)                 // no match

match([1, 2], [1, 2])       // match
match([1, 2], [3, 4])       // no match
```

The return value of the `match` function is a two element tuple (array). The first
element in the tuple indicates if the match was successful, the second element
is a JavaScript object containing the match results. We'll talk more about that
later; let's focus on successful and unsuccesful matches first!

```javascript
match(1, 1)    
> [true, {}]                // match

match(1, 2)    
> [true, {}]                // no match
```

Thus, in it's simplest form, a pattern match is an equality check **by value**,
comparing the first and second argument of the `match` function. Since checks
for value equality in JavaScript aren't trivial, this package uses [**Ramda's**](https://ramdajs.com/docs/)
`equals` function to do the heavy lifting.

### The `_` Placeholder

In the examples above, both the pattern and the value are regular JavaScript
expressions. Things get more interesting when we introduce the
*unnamed placebolder* `_`. This placeholder can be used on the **left** side
(first argument) of match to stand in for any value on the right:

```javascript
match([1, 2], [1, 2])       // match
match([1, _], [1, 2])       // match
match([_, _], [1, 2])       // match

match([5, _], [1, 2])       // no match
```

Note that using placeholders on the **right side** (second argument) of the match
will throw an error! Thus, placeholders can only be used in patterns, not in values!

In the above, the unnamed placeholder was used to stand in for a single element
of an array. However, it can also be used as a placeholder for the entire array,
or any other arbitrary data structure, no matter if flat or nested:

```javascript
match(_, 1)                     // match
match(_, [1, 2])                // match
match(_, { a: 'b' })            // match
match({ a: _ }, { a: 'b' })     // match
```

It's possible to use the unnamed placeholder multiple times in a pattern:

```javascript
match([1, _, 3, _, 5], [1, 2, 3, 4, 5])   // match
```

### Named Placeholders

If you followed the above examples, you might have seen the following return
values from the `match` function:

```javascript
[true, {}]                // match
[false, {}]               // no match
```

As mentioned above, the first argument indicates whether the match was
successful; the second argument is a JavaScript object containing successful
matches against **named placeholders**. Since we have only matched again the
unnamed placeholder `_` so far, this object has always been empty. Let's change
that!

To start using named placeholders, import them first:

```javascript
import { match, _, A, B, C, D } from 'ex-patterns';
```

Here we import the named placeholders `A`, `B`, `C` and `D`. You can import
more placeholders as needed, all the way from `A` to `L`. Then use them the same
way you used `_` before:

```javascript
const result = match([1, A, 3, B, 5], [1, 2, 3, 4, 5]);   // match
> [true, { A: 2, B: 4 }]
```

If the match is successful, the second value in the return tuple now contains
the values that the named placeholders were matches against!

Note that you can use the same **named** placeholder several times in a pattern
**as long as it is always matched against the same value**:

```javascript
match([A, A, A], [2, 2, 2]);   // match     >>  { A: 2 }
match([A, A, A], [1, 2, 3]);   // no match  >>  { }

match([_, _, _], [2, 2, 2]);   // match     >>  { }
match([_, _, _], [1, 2, 3]);   // match     >>  { }
```

You can combine unnamed and named placeholders as needed, but keep in
mind that only matches against named placeholders are returned:

```javascript
const pattern = [A, B, B, { foo: C }];
const value   = [1, 2, 2, { foo: 'k' }];
match(pattern, value);
> { A: 1, B: 2, C: 'k' }
```

### Matching on JavaScript Objects and Arrays

As mentioned, the simplest form of a pattern match is a equality comparison
by value. However, in the case of JavaScript objects (Hash Maps), a match
also counts as successful if the pattern (left) is a subset of the value (righ):

```javascript
match({ a: 1 }, { a: 1, b: 2 });    // match
```

This means that it's possible to match only against the object keys that are
relevant, instead of all keys. Note that the same is **not** true for arrays:

```javascript
match([1, 2], [1, 2, 3]);   // no match
```

Finally, named and unnamed placeholders can only be used to match against object
values, not keys. While this wouldn't be possible to begin with since JavaScript
object keys are just simple strings, it's also by design and is consisten with
pattern matching in Elixir:

```javascript
match({ _: 1 }, { foo: 1 });   // no match
match({ A: 1 }, { foo: 1 });   // no match
```
