'use strict';

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
