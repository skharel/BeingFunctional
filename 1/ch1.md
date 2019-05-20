# Being functional - what does it mean?

We recently had new team member joining our team. One of the thing I was trying to explain to him was the kind of coding style we use in our team. I told him we do "Functional Style Programming" using JavaScript. I showed him code from our repository with short explanation of what we were doing and why.

The reason this explanation was short was because even I was having hard time to craft "definition" of functional programming. So, I came home and looked up (aka googling) the definition and didn't exactly feel I could use that definition to explain our code. After few more search, I decided to go back and read few sections from the book [Functional Programming in JavaScript](https://www.manning.com/books/functional-programming-in-javascript). This is the first book I read to learn about Functional Programming (FP) and after reading few sections from it again, I finally had a plan on how to explain FP in a simplest way.

In order to explain it, I crafted a trivial JavaScript program. First, I started with non-functional style of coding and then re-implemented it using functional style. In this chapter I am going to present same example I showed to my new team mate and eventually to our entire department.

## Problem

Suppose we have following json data

```json
    {
      "first": "John",
      "middle": "M",
      "last": "Doe"
    };
```

and we wish to do the following:

1. Log the input data
2. Pick first and last attribute
3. Log the final output

> To solve this problem, I am going to use Promise API. It can be solved without using promises and synchronous code. However, to build functional solution without promise it warrants the discussion of topic such as pipe or compose which we have not even talked about yet. Using Promise, functionally it behaves (sort of) like a pipe. Therefore, I am choosing Promise API.

Let's get started with the non functional version of the code and we will convert it into functional style. Then we will describe what it meant to be functional

### Non Functional Code

> Although, this is not a basic of JS book it might be beneficial to talk just a little bit about Promises in JavaScript. For the readers who understand Promise, it is safe to skip this section. In a Promise world, you can start a chain of execution by calling `Promise.resolve` and passing some static set of data. After, that you can use as many `.then` as you want. The `then` method accepts a function and as a input to this function the data from the previous step is passed. Execution starts at the top and makes it way down.

```js  {.line-numbers}
let input = {
  first: 'John',
  middle: 'M',
  last: 'Doe'
};

function logAndReturn(data) {
  console.log(data);
  return data;
}

function pickAttribute(attributes, data) {
  let response = {};
  for (let i = 0; i < attributes.length; i++) {
    let attr = attributes[i];
    response[attr] = data[attr];
  }
  return response;
}

Promise.resolve(input)
  .then(data => logAndReturn(data)) // STEP 1
  .then(data => pickAttribute(['first', 'last'], data)) // STEP 2
  .then(data => logAndReturn(data)); // STEP 3
```

#### Step 1: Log the input data

In the above code, we started promise chain with static input. For the _first then_ method we are passing an arrow function

```js
data => logAndReturn(data);
```

When the JS engine is ready, it will invoke this arrow function and the input for this function is input that was passed to `Promise.resolve`. In this case it will be the object `{ first: 'John', middle: 'M', last: 'Doe' }` which is referred as `data` in the arrow function. When this arrow function is executed, it simply invokes the function `logAndReturn` by passing the data as a parameter. The function, `logAndReturn`, logs the data and returns the data it received.

#### Step 2: Pick first and last attribute

After the first then block, second then block is executed. For the _second then_ block, we are passing an arrow function

```js
data => pickAttribute(['first', 'last'], data);
```

The result of the first then block was `{ first: 'John', middle: 'M', last: 'Doe' }` which is the input to this second then block. When this arrow function is executed, it invokes the function `pickAttribute` to which we pass array of fields that we want to pluck from the data object. The result of this function is `{ first: 'John', last: 'Doe' }`

> Some reader more familiar with Array in JavaScript may prefer to rewrite `pickAttribute` function as:
>
> ```js
> function pickAttribute(attributes, data) {
>   return attributes.reduce((acc, attribute) => {
>     acc[attribute] = data[attribute];
>     return acc;
>   }, {});
> }
> ```
>
> This is much better then using loop because we do not need to dictate how to iterate over array, pick each item in an array and then do our actual work which is reading attribute value. This reduce method makes this code more functional then the for loop approach we used

#### Step 3: Log the final output

The return value of second step function was `{ first: 'John', last: 'Doe' }`. Just like in Step 1, this data will be logged

### Functional Code

Let's start by picking the `first then block` from the non functional code which invokes the function `logAndReturn`. Here is the snippet of code we are interested in:

```js
Promise.resolve(input).then(data => logAndReturn(data)); // STEP 1
```

As mentioned in the beginning, `then` block really needs function as a parameter. It is the responsibility of the `Promise` API to invoke this function with _a parameter_ and therefore the function referenced in then block **must** be unary function.

In our code, we were simply using the arrow function to invoke the function `logAndReturn` with appropriate params. We really do not need the arrow function and can rewrite STEP 1 as:

```js
Promise.resolve(input).then(logAndReturn); // STEP 1
```

> Congrats! you just learned **POINT FREE** style in functional programming. The arrow function existed as a glue only to call the function `logAndReturn` by providing the argument it received. Removing such glue code just to pass arguments makes your code point free. This style makes composing all simpler function much more easier as we will see later.

Similarly, we can be point free for STEP 3. Here is new snippet of Promise chain:

```js
Promise.resolve(input)
  .then(logAndReturn)
  .then(data => pickAttribute(['first', 'last'], data)) // STEP 2
  .then(logAndReturn);
```

> **Tap**: The function `logAndReturn` has interesting behavior. It takes an input, does something (such as calling other function) and then returns the input unchanged. This kind of behavior is called `tap`. Now knowing what `tap` means, I think a better name for the function `logAndReturn` is `tapLog`. Let's rewrite the promise chain using this new name as:

```js
let input = {
  first: 'John',
  middle: 'M',
  last: 'Doe'
};

function tapLog(data) {
  console.log(data);
  return data;
}

function pickAttribute(attributes, data) {
  return attributes.reduce((acc, attribute) => {
    acc[attribute] = data[attribute];
    return acc;
  }, {});
}

Promise.resolve(input)
  .then(tapLog)
  .then(data => pickAttribute(['first', 'last'], data) // STEP 2
  .then(tapLog);
```

Now lets move to the function `pickAttribute`. For Step 1 & Step 3, we were able to replace the arrow function's with `point free` code by using the function `tapLog` because the airity, number of arguments, of `tapLog` was one. However, for the function `pickAttribute`, airity is two. It _seems_ like we really cannot replace the "glue" arrow function for step 2. 🤔

`Closure` to the rescue! Using `Closure` we can reduce the number of arguments for this function. But before I show how, let's analyze arguments for the function `pickAttribute`. It's _first argument_ is an array of attributes that we want to pick (from data - second argument); it's _second argument_ is data we want to operate on.

> For this function `pickAttribute` we could have ordered these 2 arguments in reverse order but there is a very good reason why we passed data in second argument, in this case the last argument. After we re-implement the function `pickAttribute` the reason for this particular ordering, where data is passed as last argument, should be clear. As a functional programmer, **memorize the mantra "data last"**

Back to analysis of the arguments, we knew the value for the first argument, properties that we wanted to pick, when we wrote this program. The only unknown part was the data because we did not know what we will get when this program is executed. Now, let's re-write this function `pickAttribute` in a way that we could partially execute this function with the known argument and later be able to specify the unknown argument, which is almost always data, and then execute this function. Using closure we can re-write as:

```js
function pickAttribute(attributes) {
  return function pickAttributeHelper(data) {
    // some code goes here that uses attributes and data arguments
    // return correct data
  };
}
```

This is suddenly a very interesting function because it is a function that returns another function. Let's look at following piece of code that invokes this new function `pickAttribute`

```js
let bob = pickAttribute(['first', 'last']);
```

When we invoke first function `pickAttribute` with known values, it returned the inner function `pickAttributeHelper` which takes only the data argument. When the result of this invocation is assigned to variable `bob`, it references this inner function `pickAttributeHelper` which means bob is a function waiting for the `data` parameter. Now, let's go back to the `then` block in Promise chain. In order to replace the glue arrow function in Step 2 - `data => pickAttribute(['first', 'last'], data`, we wanted a function that takes data argument. The shape of this new function `bob` aka `pickAttributeHelper` matches that. This means we can re-write our promise chain as:

```js
function pickAttribute(attributes) {
  return function pickAttributeHelper(data) {
    // some code goes here that uses attributes and data arguments
    // return correct data
  };
}

let bob = pickAttribute(['first', 'last']);

Promise.resolve(input)
  .then(tapLog)
  .then(bob)
  .then(tapLog);
```

In this code snippet, we can certainly remove the line where we declared bob and replace the bob in the promise chain with actual call to the function `pickAttribute` as:

```js
function pickAttribute(attributes) {
  return function pickAttributeHelper(data) {
    // some code goes here that uses attributes and data arguments
    // return correct data
  };
}

Promise.resolve(input)
  .then(tapLog)
  .then(pickAttribute(['first', 'last']))
  .then(tapLog);
```

This code certainly reads a lot better then having bob in the middle. Best of all, the name bob was not even very good one and now we don't even have to think about a better name for bob. While we are at it let's finish coding `pickAttribute` by filling the inner function `pickAttributeHelper`

```js
function pickAttribute(attributes) {
  return function pickAttributeHelper(data) {
    return attributes.reduce((acc, attribute) => {
      acc[attribute] = data[attribute];
      return acc;
    }, {});
  };
}
```

I literally copy pasted the content from the non functional code that we looked earlier to finish this implementation. Did you notice how `closure` comes into picture in this code?

> Closure is observed for the attributes argument because when the inner function executes, it makes the use of the outer function's argument.

Here is the final **functional code**

```js
let input = {
  first: 'John',
  middle: 'M',
  last: 'Doe'
};

function tapLog(data) {
  console.log(data);
  return data;
}

function pickAttribute(attributes) {
  return function pickAttributeHelper(data) {
    return attributes.reduce((acc, attribute) => {
      acc[attribute] = data[attribute];
      return acc;
    }, {});
  };
}

Promise.resolve(input)
  .then(tapLog)
  .then(pickAttribute(['first', 'last']))
  .then(tapLog);
```

## Functional Programming

<p align="center">
    <img src="images/data_viz.png" width="40%">
</p>

This fountain quite elegantly captures the kind of mind set we should have when writing Functional Style of code.

In this water fountain intermediate containers are placed in such a way that when water starts to flow from the top, subsequent container can collect them and pass to the next one until it makes it way to the bottom. As the water flows, each of these intermediate container can totally do something different as the water makes through it. For eg first container can mix red color, second one blue color etc. The only constraint for this fountain is that each intermediate container must eventually pass liquid else it will break down. Also, it is the expectation of each subsequent container that the container before it passes liquid.

Now let's revisit the functional `Promise.chain` one more time.

```js
Promise.resolve(input)
  .then(tapLog)
  .then(pickAttribute(['first', 'last']))
  .then(tapLog);
```

This Promise chain is analogous to the water fountain image shown above. `Promise.resolve` is equivalent to the top of the fountain from which water starts to flow. Each `then` block is equivalent to the intermediate container of the fountain. The only constraint on subsequent then block is that they must be able to operate on the data returned by previous step.

> With Functional Programming, our goal is to build an abstract flow of control that eventually operates on data. Our mindset should be set on building a fountain with right containers that is eventually just waiting for data to operate on.

[WORK IN PROGRESS]
