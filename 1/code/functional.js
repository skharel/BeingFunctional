'use strict';

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
  .then(data => pickAttribute(['first', 'last'], data))
  .then(tapLog);
