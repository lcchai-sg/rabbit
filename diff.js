const _ = require('lodash');

/**
 * Deep diff between two object, using lodash
 * @param  {Object} object Object compared
 * @param  {Object} base   Object to compare with
 * @return {Object}        Return a new object who represent the diff
 */
function difference(object, base) {
  function changes(object, base) {
    return _.transform(object, function (result, value, key) {
      if (!_.isEqual(value, base[key])) {
        result[key] = (_.isObject(value) && _.isObject(base[key])) ? changes(value, base[key]) : value;
      }
    });
  }
  return changes(object, base);
}

var m1 = ["18K Rose Gold"]
var m2 = ["18K Rose Gold"]
var m3 = ["18K rose gold"]
console.log(m1, m2, difference(m1, m2).length > 0 ? "not same" : "same")
console.log(m1, m3, difference(m1, m3).length > 0 ? "not same" : "same")
console.log()
console.log()

var s1 = [{ "type": "diamond", "quantity": 1, "shape": "round" }]
var s2 = null;
var s3 = [];
var s4 = [{ "type": "diamond", "quantity": 1, "shape": "round" }]
var s5 = [{}];
console.log(s1, s2, difference(s1, m2).length > 0 ? "not same" : "same")
console.log(s1, s3, difference(s1, s3).length > 0 ? "not same" : "same")
console.log(s1, s4, difference(s1, s4).length > 0 ? "not same" : "same")
console.log(s1, s5, difference(s1, s5).length > 0 ? "not same" : "same")
console.log()
console.log()

let v1 = { "type": "diamond", "quantity": 2 };
let v2 = { "type": "diamond", "quantity": 2, "shape": null, "size": null };
let v3 = { "type": "Diamond", "quantity": 2 };
let v4 = { "type": "diamond", "quantity": 3 };
console.log(v1, v2, difference(v1, v2).length > 0 ? "not same" : "same")
console.log(v1, v3, difference(v1, v3).length > 0 ? "not same" : "same")
console.log(v1, v4, difference(v1, v4).length > 0 ? "not same" : "same")
console.log()
console.log()

let vv1 = { "type": "diamond", "quantity": 2, "shape": null, size: null };
let vv2 = { "type": "diamond", "quantity": 2, "shape": null, size: null };
let vv3 = { "type": "diamond", "quantity": 1, "shape": null };
let vv4 = { "type": "diamond", "quantity": 2 };
console.log(vv1, vv2, difference(vv1, vv2).length > 0 ? "not same" : "same")
console.log(vv1, vv3, difference(vv1, vv3).length > 0 ? "not same" : "same")
console.log(vv1, vv4, difference(vv1, vv4).length > 0 ? "not same" : "same")
console.log()
console.log()

let x1 = { "type": "diamond", "quantity": 2, "shape": null, size: null };
let x2 = { "type": "diamond", "quantity": 2, "shape": null };
let x3 = { "type": "diamond", "quantity": 2 };
let x4 = { "type": "diamond", "quantity": 3 };
let x5 = { "type": "diamond", "quantity": 2, "shape": "Round" };
console.log(x3, x1, _.isEqual(x3, x1) ? "same" : "not same")
console.log(x3, x1, _.isEqual(x3, x2) ? "same" : "not same")
console.log(x3, x4, _.isEqual(x3, x4) ? "same" : "not same")
console.log(x3, x5, _.isEqual(x3, x5) ? "same" : "not same")
Object.keys(x1).forEach(key => {
  if (!x1[key]) delete x1[key];
})
console.log(x3, x1, _.isEqual(x3, x1) ? "same" : "not same")
Object.keys(x2).forEach(key => {
  if (!x2[key]) delete x2[key];
})
console.log(x3, x2, _.isEqual(x3, x2) ? "same" : "not same")

console.log()
console.log()
