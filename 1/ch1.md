# Being functional - what does it mean?

We recently had new team member joining our team. One of the thing I was trying to explain to him was the kind of coding style we use in our team. I told him we do "Functional Style Programming" using JavaScript. I showed him code from our repository with short explanation of what we were doing and why.

The reason this explanation was short was because even I was having hard time to craft "definition" of functional programming. So, I came home and looked up (aka googling) the definition and didn't exactly feel I could use that definition to explain our code. After few more search, I decided to go back and read few sections from the book [Functional Programming in JavaScript](https://www.manning.com/books/functional-programming-in-javascript). After reading a particular line, which I will get in towards the later section, it enlightened me again. This was the first book I read, to learn about Functional Programming (FP) and it is where I get back for more details on some topics.

After that enlightenment, I had plan on how to explain what we are doing. In this part of the book, I am going to use the same code example I showed to him and eventually to our entire department.

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
let data = [1, 2, 3, 4, 5];

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

> Some reader more familiar with Array ib JavaScript may prefer to rewrite `pickAttribute` function as:
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

Now lets move to updating the function `pickAttribute`. From earlier discussion, we were able to replace the arrow function with the function `tapLog` because airity, number of arguments, of this function is one. For the function `pickAttribute`, the airity count is 2. So, it _appears_ we really cannot replace the arrow function for step 2. 🤔

`Closure` to the rescue!

[WORK IN PROGRESS]
