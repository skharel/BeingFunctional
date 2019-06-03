'use strict';

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
  return newData;
}

myAPI({
  first: 'John',
  middle: 'M',
  last: 'Doe'
});
