const _ = require('lodash');

var isArrayEqual = function (x, y) {
  return _(x).xorWith(y, _.isEqual).isEmpty();
};

var result1 = isArrayEqual(
  [{ a: 1, b: 2 }, { c: 3, d: 4 }],
  [{ b: 2, a: 1 }, { d: 4, c: 3 }]
);

var result2 = isArrayEqual(
  [{ a: 1, b: 2, c: 1 }, { c: 3, d: 4 }],
  [{ b: 2, a: 1 }, { d: 4, c: 3 }]
);

var result3 = isArrayEqual(
  [{ a: 1, b: 2, c: 1 }, { c: 3, d: 4 }],
  [{ b: 2, a: 1 }, { d: 4, c: 3 }, undefined]
);

var getResult1 = ["18K Rose Gold"]
var base1 = ["18K Rose Gold"]
var base2 = ["18K rose gold"]

var getResult2 = [{ "type": "diamond", "quantity": 1, "shape": "round" }]
var base21 = null;
var base22 = [];
var base23 = [{ "type": "diamond", "quantity": 1, "shape": "round" }]
var base24 = [{}];

var r1 = isArrayEqual(getResult1, base1);
var r2 = isArrayEqual(getResult1, base2);
// console.log('base:', base1, 'get:', getResult1, r1)
// console.log('base:', base2, 'get:', getResult1, r2)

var r21 = isArrayEqual(getResult2, base21);
var r22 = isArrayEqual(getResult2, base22);
var r23 = isArrayEqual(getResult2, base23);
var r24 = isArrayEqual(getResult2, base24);
// console.log('base:', base21, 'get:', getResult2, r21)
// console.log('base:', base22, 'get:', getResult2, r22)
// console.log('base:', base23, 'get:', getResult2, r23)
// console.log('base:', base24, 'get:', getResult2, r24)

let v1 = { "type": "diamond", "quantity": 2 };
let v2 = { "type": "diamond", "quantity": 2 };
let v3 = { "type": "Diamond", "quantity": 3 };
// console.log('v1 v2', isArrayEqual(v1, v2))
// console.log('v1 v3', isArrayEqual(v1, v3))

let arr1 = [{ "type": "diamond", "quantity": 1 }]
let arr2 = [{ "type": "diamond", "quantity": 1 }]
let arr3 = [{ "type": "diamond", "quantity": 2 }]
console.log(arr1, arr2, isArrayEqual(arr1, arr2))
console.log(arr1, arr3, isArrayEqual(arr1, arr3))

