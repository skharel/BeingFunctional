# Being functional - what does it mean?

We recently had new team member joining our team. One of the thing I was trying to explain to him was the kind of coding style we use in our team. I told him we do "Functional Style Programming" using JavaScript. I showed him code from our repository with short explanation of what we were doing and why.

The reason this explanation was short was because even I was having hard time to craft "definition" of functional programming. So, I came home and looked up (aka googling) the definition and didn't exactly feel I could use that definition to explain our code. After few more search, I decided to go back and read few sections from the book [Functional Programming in JavaScript](https://www.manning.com/books/functional-programming-in-javascript). After reading a particular line, which I will get in towards the later section, it enlightened me again. This was the first book I read, to learn about Functional Programming (FP) and it is where I get back for more details on some topics.

After that enlightenment, I had plan on how to explain what we are doing. In this part of the book, I am going to use the same code example I showed to him and eventually to our entire department.

## Problem

Suppose we have a data set

```
    var data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
```

and we wish to do the following:

1. log the input data
2. add 1 to each element
3. log the data again
4. filter even number
5. log the final output

> I am going to work in this problem my starting a promise chain but it does not necessarily have to be solved using Promises. It can be solved using synchronous mechanism. However, to build functional solution it warrants the discussion of topic such as pipe or compose. Therefore, I am choosing Promise API.

Let's get started with the non functional version of the code and we will convert it into functional style. Then we will describe what it meant to be functional

### The non-functional code

#### Step 1: log the input data

```
    Promise.all(data).then(d => console.log(d));
```
