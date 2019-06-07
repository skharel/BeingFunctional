# Getting functional

We recently had new team member joining our team. As part of onboarding I was giving him an overview of coding practice we follow and quickly mentioned that we do "Functional Style Programming" using JavaScript. I pulled some code from our repository and tried to explain what was going on; but I was quite unsatisfied with my own explanation.

The reason I was unsatisfied was because it was hard for me to craft a working "definition" of Functional Programming, here on referred as FP, that would capture the gist of the code example I showed. So, I cam back home and looked up (aka googled) the definition and didn't exactly feel I could use those definition either to explain the concept. After few more search, I decided to go back and read some sections of the book [Functional Programming in JavaScript](https://www.manning.com/books/functional-programming-in-javascript). This is the first book I read to learn about FP and I absolutely loved it. After reading few sections from this book again, I finally had a plan on how to explain FP in a simplest way.

In order to explain it, first I crafted a trivial problem; then I implemented a solution to it using non-functional style. After that, I implemented a more functional approach solution. After that I was motivated enough to give an overview of FP to our department and then I wanted to write more about it.

In this chapter I am going to get started with the same trivial problem and implement non-functional as well as functional style. Hopefully, this helps the reader grasp basic idea of the FP and how to think about it when implementing it.

## The Problem

Suppose we have JSON object that we get as input. Let's assume that in this input there will always be `first` & `last` attribute. We want to implement a program that does following
<a id="four-things"> 4 things:</a>

1. Log the input data
2. Pick first and last attribute
3. Log the output
4. Return new value

Let's assume in one case we received following JSON data as input:

```json
{
  "first": "John",
  "middle": "M",
  "last": "Doe"
}
```

### Non Functional Code

```js
function log(data) {
  console.log(data);
}

function pickAttribute(attributes, data) {
  let response = {};
  for (let i = 0; i < attributes.length; i++) {
    let attr = attributes[i];
    response[attr] = data[attr];
  }
  return response;
}

function myAPI(input) {
  log(input); // STEP 1
  let newData = pickAttribute(['first', 'last'], input); // STEP 2
  log(newData); // STEP 3
  return newData; //STEP 4
}

myAPI({
  first: 'John',
  middle: 'M',
  last: 'Doe'
});
```

In the above code the function `myAPI` is how we expose our solution to the user. Eventually this API is invoked with some JSON object and it does the <a href="#four-things"> 4 things </a> we wanted to do

#### Step 1: Log the input data

```js
log(input);
```

This is pretty trivial step. We simply make use of `console.log` to log the data

#### Step 2: Pick first and last attribute

```js
let newData = pickAttribute(['first', 'last'], input);
```

In this step, we make use of the helper function `pickAttribute` to provide with an array of fields we want to pick from the data, second argument. The result of this function is an object with only the fields we provided.

The result of this step is `{ first: 'John', last: 'Doe' }` which is assigned to the variable `newData`.

> <a id="pickAttribute">Some reader more familiar with Array in JavaScript may prefer to rewrite `pickAttribute` function as: </a>
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
> When we used loop, we needed to dictate how to iterate over array - take care of bounds, pick every element form the array. After picking the element, then only we are at the point where we execute the code that we really wanted to write which is reading the attribute value. This approach is referred to as **Imperative Approach**.
>
> When we make use of `reduce` method we are getting more declarative. This is because we only need to provide function that describes the things that we wanted to do - pick each attribute and how we collect them. In other words we directly get started with doing our work rather then laying out the ground work needed to get to our point of interest. This approach is referred to as **Declarative Approach** and is also more Functional. Object destructuring, array destructuring, spread operator, rest operator etc. are few examples of the JavaScript API that will help you write declarative code.

#### Step 3: Log the output

```js
log(newData); // STEP 3
```

This is same as step 1 but here we are logging the object `{ first: 'John', last: 'Doe' }` to console.

#### Step 4: Return new value

```js
return newData; //STEP 4
```

Finally, we return `{ first: 'John', last: 'Doe' }` from the function `myAPI`.

### Functional Code

In order to build functional solution, we need to make use of some of the functional concepts such as pipe or compose. However, we are just getting started and have not covered these concepts. However, using `Promise` API from JavaScript we can build flow of data just like pipe or compose. Therefore, I am going to make use of Promise to build functional solution.

> This book is not about basics of JavaScript. So, we will skip an elaborate discussion of Promise and refer to [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) if you want to read more about Promises.

```js
function logAndReturn(data) {
  console.log(data);
  return data;
}

function pickAttribute(attributes, data) {
  return attributes.reduce((acc, attribute) => {
    acc[attribute] = data[attribute];
    return acc;
  }, {});
}

function myAPI(params) {
  return Promise.resolve(params)
    .then(data => logAndReturn(data)) // STEP 1
    .then(data => pickAttribute(['first', 'last'], data)) // STEP 2
    .then(data => logAndReturn(data)); // STEP 3 & 4
}

myAPI({
  first: 'John',
  middle: 'M',
  last: 'Doe'
});
```

In the function `myAPI`, we started `Promise` chain by making use of `Promise.resolve` and provided the params as argument to `resolve` method. Then there are three `then` blocks which does the <a href="#four-things"> 4 things </a> that we want to.

#### Step 1: Log the input data

```js
return Promise.resolve(params).then(data => logAndReturn(data));
```

In the above code, we started promise chain with static input. Then in the `.then` method we are passing an arrow function

```js
data => logAndReturn(data);
```

When JS engine is ready, it will invoke this arrow function and the input for this function is argument that was passed to `Promise.resolve`. In this case it will be the object `{ first: 'John', middle: 'M', last: 'Doe' }` and is referenced by variable `data`. When this arrow function is executed, it simply invokes the function `logAndReturn` by passing data as a parameter. The function `logAndReturn` logs the data and returns the data it received.

The arrow function here is simply a `glue code` and all it did was invoked the function `logAndReturn` by providing the exact argument it received. There really is _no point_ in having this glue code present just to invoke another function by providing the argument. We can remove this glue code and re-write it as

```js
return Promise.resolve(params).then(logAndReturn);
```

> Congrats! you just learned **POINT FREE** style. It is a paradigm where we do not mention the argument your code is operating in. You will encounter many more point free style when building pipelines in later chapters. As you will see later, by using point free style composing functions to build pipelines will be much more easier then having to write a glue code.

#### Step 3 & 4: Log the output & Return new value

Step 3 & 4 uses same function `logAndReturn` as in step 2. So, we can re-write it using point free style too.

Here is new implementation for the function `myAPI`

```js
function myAPI(params) {
  return Promise.resolve(params)
    .then(logAndReturn) // STEP 1
    .then(data => pickAttribute(['first', 'last'], data)) // STEP 2
    .then(logAndReturn); // STEP 3 & 4
}
```

#### Step 2: Pick first and last attribute

```js
then(data => pickAttribute(['first', 'last'], data)); // STEP 2
```

First thing to notice in this the block is the usage of arrow function - glue code. In Step 1 & 3, the reason we were able to replace glue code with point free version was because the function `logAndReturn` was unary. However, function `pickAttribute` is a binary function. It _seems_ like we really cannot replace the "glue" arrow function for step 2. Or can we? 🤔

`Closure` to the rescue! Using `Closure` we can reduce the number of arguments for this function. But before I show how, let's analyze arguments for the function `pickAttribute`. It's _first argument_ is an array of attributes that we want to pick from it's _second argument_ - the data this function is going to operate on. We could have ordered these 2 arguments in reverse order but there is a very good reason why we passed data in second argument, in this case the last argument, and the reason for passing data last will be clear once we re-implement the function `pickAttribute` using `closure`.

> As a functional programmer, **memorize the mantra "data last"**

Back to analysis of the arguments for `pickAttribute`, even before we started to implement the function `myAPI` we knew that we wanted to pick the attribute first and last from the data that we will eventually receive. The only unknown part is the data & it's up to the caller of the function `myAPI` to specify the data.

Let's try to re-implement this function `pickAttribute`. When trying to reduce the arity - number of arguments passed to the function, the way we want to think is "how do I specify the arguments that I know now and then later provide the unknown argument? When all the arguments are provided, this function needs to execute by making use of the known arguments passed earlier and the data arguments passed later".

Show me the code already:

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

When we invoke the function `pickAttribute` with known values, it returned the inner function `pickAttributeHelper` which takes only the data argument. When the result of this invocation is assigned to variable `bob` and now it references inner function `pickAttributeHelper` which means bob is a function waiting for the `data` parameter. The signature of `bob` - aka `pickAttributeHelper`, is analogous to the signature of the function `logAndReturn` because they are both waiting for the `data`. Here is new snippet of `myAPI`

```js
function pickAttribute(attributes) {
  return function pickAttributeHelper(data) {
    // some code goes here that uses attributes and data arguments
    // return correct data
  };
}

let bob = pickAttribute(['first', 'last']);

function myAPI(params) {
  return Promise.resolve(params)
    .then(logAndReturn)
    .then(bob)
    .then(logAndReturn);
}
```

Now, that we have seen this new snippet we could argue that we really don't need to declare the variable bob just to be referenced in then block. We can re-write `myAPI` as:

```js
function pickAttribute(attributes) {
  return function pickAttributeHelper(data) {
    // some code goes here that uses attributes and data arguments
    // return correct data
  };
}

function myAPI(params) {
  return Promise.resolve(params)
    .then(logAndReturn)
    .then(pickAttribute(['first', 'last']))
    .then(logAndReturn);
}
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

I literally copy pasted the content from the <a href="#pickAttribute"> code that we looked earlier </a>. Did you notice how `closure` comes into picture in the new implementation `pickAttribute` of code?

> Closure is observed for the argument attributes because when the inner function executes, it makes the use of the outer function's argument.

> The other important feature of this new version of `pickAttribute` is that it's a _lazy function_. When we initially executed this function as `pickAttribute(['first', 'last'])`, it only executed partially; for it to execute it completely it needs a second invocation with data attribute.

> One last thing to note is that, there are techniques such as _currying_ and _partial application_ - to be discussed in later chapter, that will help us avoid having to write a function that returns function (and so on). By understanding how a function that returns function is a lazy one and how closure comes into play understanding _currying_ and _partial application_ will be much more easier.

Here is the final implementation of **functional code**

```js
function logAndReturn(data) {
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

function myAPI(params) {
  return Promise.resolve(params)
    .then(logAndReturn)
    .then(pickAttribute(['first', 'last']))
    .then(logAndReturn);
}

myAPI({
  first: 'John',
  middle: 'M',
  last: 'Doe'
});
```

Now that we have seen the functions style of code, let's talk about what makes this code functional.

## Functional Style Programming

<p align="center">
    <img src="images/data_viz.png" width="40%"/>
</p>

This fountain quite elegantly captures the kind of mind set we should have when writing Functional Style of code. Let's see this fountain from Functional Side.

In this fountain flow of liquid starts at the top, 1<sup>st</sup> container. Then it makes it's way through the 2<sup>nd</sup>, 3<sup>rd</sup> and 4<sup>th</sup> container and finally to bottom where it's getting collected. There is an implicit requirement for this fountain to work. Can you guess what it is?

This system works only with liquid! When liquid starts to flow from the top, 1<sup>st</sup> container will start to collect it and eventually it overflows; then same cycle happens with the next one and so on. As long as it honors the contract that liquid flows through, this fountain will operate without any issues. The other thing to observe is that as the liquid makes it's way through these containers, they are free to operate on it. For example some container might add red color while some might add green; some may even choose to do nothing and just pass the liquid as it received.

If you think from programming side, we could say that the whole fountain is analogous to our function `myAPI`. Each container in this fountain is analogous to the function in `then` block of the `Promise` chain. We can see that just as liquid flows from upper container to lower one, data flows from upper then block to the lower then block. Finally, just as theses containers are waiting only for liquid to flow through, our functions in then block are waiting only for data. This behavior of function being ready and waiting only for data is more profound in case of lazily executed function `pickAttribute(['first', 'last'])`, which is now simply waiting for data.

This is exactly our goal when we write functional style of code. We need to build a pipeline of code - aka a system, by making use of simpler functions which are either lazily executed or not executed at all and waiting for the "data". As soon as the data flows through this pipeline, the system will fully execute.

## Summary

At the end of this chapter, the one take way we want to have is an understanding of what makes a code functional. We want to build pipeline by composing simpler functions that are waiting for data. When data flows through this pipeline, it goes through each of these functions; each functions operates on them and returns value for next function and finally some value is returned by this pipeline.
