![build](https://github.com/moritzploss/ex-patterns/workflows/Build/badge.svg)
![tests](https://github.com/moritzploss/ex-patterns/workflows/Tests/badge.svg)

# Ex Patterns

This package brings Elixir-style [**pattern matching**](https://elixir-lang.org/getting-started/pattern-matching.html)
and control flow structures to JavaScript.

## What's in the Box

At the core of this package is 

## Getting Started

Install the package from npm:

    npm i ex-patterns

Or clone the git repo:

    git clone git@github.com:moritzploss/ex-patterns.git

## Examples

### Imports

To follow along with the examples, start by importing the `match` function as
well as `_` (underscore), the *unnamed placeholder*. Also import the control
flow structure `when`, the `end` symbol as well as the named placeholders `A`,
`B` and `C.`

```javascript
import { match, _, when, A, B, C } from 'ex-patterns';
```

### Pattern Matching

If you have never heard about pattern matching in Elixir, it's probably good
to skim through the [**Elixir Docs**](https://elixir-lang.org/getting-started/pattern-matching.html)
on the subject. In essence, it's a way of destructuring complex (or simple)
data structures and extracting the information that you're interested in. This
can result in a much cleaner and expressive programming style with fewer
conditionals and less explicit branching logic.

In JavaScript, the equal sign is the assignment operator. Therefore,
a variable on the left side can be *assigned* any value on the right side.

```javascript
const a = 1;
const b = { foo: 'bar' };
const c = [1, 2, 3];
```

Note that we always have a variable name on the left side of the assignment
operator, and a data structure on the right side.  Simply speaking, pattern
matching allows us to have data structures on both sides of the `=` sign,
and to evaluate if both sides can be made to match each other.

```javascript
1 = 1                   // match
'hello' = 'hello'       // match
[1, 2, 3] = [1, 2, 3]   // match

0 = 1                   // no match
'hello' = 'world'       // no match
[1, 2, 3] = [4, 5, 6]   // no match
```

In the examples above, both sides of the equation use regular JavaScript
expressions. Things get more interesting when we introduce the
*unnamed placebolder* `_`. This placeholder can be used on the left side of the
equation to stand in for any value on the right:

```javascript
_ = 1                   // match
_ = 'hello'             // match
[1, _, 3] = [1, 2, 3]   // match
```


