const { Mappers } = require('./utils');
const data = require('./band_material');

(async () => {
  const updated = []; const noMatch = [];
  data.forEach(v => {
    const { bm: r, } = Mappers.getMaterial.map(v);
    if (r) updated.push(r + ' >>> ' + v);
    else noMatch.push(v);
  })
  updated.sort();
  console.log('updated : ', updated.length);
  updated.forEach(v => console.log(v));
  noMatch.sort();
  console.log('no match : ', noMatch.length);
  noMatch.forEach(v => console.log(v));
  process.exit(0);
})();