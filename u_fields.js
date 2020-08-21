const _ = require('lodash');

const j = {
  "id": 1234,
  "name": "Ring XxX",
  "category": "rings",
  "reference": "XxX1234",
  "price": 1234.23,
  "materials": ["18K Rose Gold", "18K Yellow Gold"],
  "sizes": [4, 5, 6, 7, 8, 9],
  "stones": [
    { "type": "Diamond", "quantity": 3, "shape": "X" },
    { "type": "Emerald", "quantity": 1, "shape": "Round", "size": "2 mm" }
  ],
  "box": { "type": "Giftbox A", "shape": "Square", "color": "navy" }
};

const u = [
  // path reference = string
  // update
  { test: "update reference ''", op: 'update', path: 'reference', value: '1234XxX', base: 'XxX1234' },
  // remove
  { test: "update reference ''", op: 'update', path: 'reference', value: null, base: '1234XxX' },
  // add
  { test: "update reference ''", op: 'update', path: 'reference', value: '1234XxX', base: null },

  // path price = number
  // update
  { test: "update price num", op: 'update', path: 'price', value: 2121.00, base: 1234.23 },
  // delete
  { test: "update price num", op: 'update', path: 'price', value: null, base: 2121.00 },
  // add
  { test: "update price num", op: 'update', path: 'price', value: 2121.00, base: null },

  // path materials = ['', '', '']
  // add or remove element will be the same
  { test: "update materials ['', '', '']", op: 'update', path: 'materials', value: ["18K Rose Gold", "Platinum"], base: ["18K Rose Gold", "18K Yellow Gold"] },
  // delete
  { test: "update materials ['', '', '']", op: 'update', path: 'materials', value: [], base: ["18K Rose Gold", "Platinum"] },
  // add
  { test: "update materials ['', '', '']", op: 'update', path: 'materials', value: ["18K Rose Gold", "Platinum"], base: null },

  // path "box" : { "type": "", "shape": "", "color": ""}
  // treat like array?
  // add new field
  {
    test: 'update box { "type": "", "shape": "", "color": ""}', op: 'update', path: 'box',
    value: { "type": "Giftbox A", "shape": "Square", "color": "navy", "free": true },
    base: { "type": "Giftbox A", "shape": "Square", "color": "navy" }
  },
  // update field
  {
    test: 'update box { "type": "", "shape": "", "color": ""}', op: 'update', path: 'box',
    value: { "type": "Giftbox A", "shape": "Square", "color": "red", "free": true },
    base: { "type": "Giftbox A", "shape": "Square", "color": "navy", "free": true }
  },
  // remove 1 field
  {
    test: 'update box { "type": "", "shape": "", "color": ""}', op: 'update', path: 'box',
    value: { "type": "Giftbox A", "shape": "Square", "color": "red" },
    base: { "type": "Giftbox A", "shape": "Square", "color": "red", "free": true }
  },

  // array of objects
  // eg stones = [{type: '', quantity: , shape: ''}, {type: '', quantity: , shape: ''}...]
  // remove stone
  {
    test: 'update stones [{}, {}, {}]', op: 'update', path: 'stones',
    value: [
      { "type": "Diamond", "quantity": 3, "shape": "X" }
    ],
    base: [
      { "type": "Diamond", "quantity": 3, "shape": "X" },
      { "type": "Emerald", "quantity": 1, "shape": "Round", "size": "2 mm" }
    ]
  },

  // add new stone
  {
    test: 'update stones [{}, {}, {}]', op: 'update', path: 'stones',
    value: [
      { "type": "Diamond", "quantity": 3, "shape": "X" },
      { "type": "Emerald", "quantity": 1, "shape": "Round", "size": "2 mm" }
    ],
    base: [{ "type": "Diamond", "quantity": 3, "shape": "X" }]
  },

  // update stone
  {
    test: 'update stones [{}, {}, {}]', op: 'update', path: 'stones',
    value: [
      { "type": "Diamond", "quantity": 1, "shape": "X" },
      { "type": "Emerald", "quantity": 1, "shape": "X" }
    ],
    base: [
      { "type": "Diamond", "quantity": 3, "shape": "X" },
      { "type": "Emerald", "quantity": 1, "shape": "Round", "size": "2 mm" }
    ]
  },
];

// const isEqual = (arr1, arr2) => {
//   if (typeof arr1 !== 'object' || typeof arr2 !== 'object') return false;
//   if (Array.isArray
//     arr1.length !== arr2.length) {
//     return false;
//   }
//   arr1.sort(); arr2.sort();
//   for (let i = 0; i < arr1.length; i++) {
//     if (typeof arr1[i] !== typeof arr2[i]) return false;
//     if ()
//   }
// }

(async () => {
  for (const upd of u) {
    if (_.has(j, upd.path)) {
      const odata = _.get(j, upd.path)
      if (_.isEqual(odata, upd.base)) {
        console.log(upd)
        _.set(j, upd.path, upd.value)
        console.log(j)
      } else {
        console.log('not updated')
        console.log('od>', odata)
        console.log('nd>', upd.base)
      }
    }

    await new Promise((r) => setTimeout(r, 5000))
  }
})();