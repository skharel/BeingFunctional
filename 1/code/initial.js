'use strict';

let data = [1, 2, 3, 4, 5];

Promise.all(data).then(d => console.log(d));
