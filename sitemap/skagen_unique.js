const u = require('./skagen_sm');

let r = [];
let result = {};
for (let i = 0; i < u.length; i++) {
  if (!u[i].match(/band|watch-strap/i)) {
    let v = u[i].split('-');
    let ref = v[v.length - 1];
    if (r.indexOf(ref) < 0) {
      r.push(ref);
      result[ref] = [];
    }
    result[ref].push(u[i]);

  }
}

console.log('u ref >>>', r.length);
r.forEach(rr => {
  console.log('reference >>>', rr)
  result[rr].forEach(u => {
    let v = u.split('/')
    console.log('     ', u, '   ', v.length)
  })
})