'use strict';

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
