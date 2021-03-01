const idss = require('./garmin_ids');
const u = require('./garmin_u');

const ids = idss.map(r => r.split("|")[1].trim());

ids.forEach(url => {
  if (u.indexOf(url) < 0) console.log('not in u : ', url);
})
u.forEach(url => {
  if (ids.indexOf(url) < 0) console.log('not in ids : ', url);
})
