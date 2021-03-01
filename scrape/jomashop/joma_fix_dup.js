// const u = require('./joma_dup_urls');
const { MongoClient } = require('mongodb');
const _ = require('lodash');

const u = [
  "https://www.jomashop.com/mido-watch-m021-431-11-041-00.html",
  "https://www.jomashop.com/mathey-tissot-watch-h710ai.html",
  "https://www.jomashop.com/mido-watch-m005-614-36-051-22.html",
  "https://www.jomashop.com/mido-watch-m026-430-22-051-00.html",
  "https://www.jomashop.com/mido-watch-m016-414-11-041-00.html",
  "https://www.jomashop.com/mido-comander-watch-m021-626-36-051-00.html",
  "https://www.jomashop.com/mido-watch-m026-430-37-051-00.html",
  "https://www.jomashop.com/glashutte-watch-39-59-01-05-04.html",
  "https://www.jomashop.com/mido-watch-m027-408-16-018-00.html",
  "https://www.jomashop.com/mido-watch-m027-207-16-010-00.html",
  "https://www.jomashop.com/mido-watch-m005-914-17-030-00.html",
  "https://www.jomashop.com/mido-watch-m027-408-11-011-00.html",
  "https://www.jomashop.com/mido-watch-m8600-3-64-8.html",
  "https://www.jomashop.com/invicta-angel-watch-30967.html",
  "https://www.jomashop.com/tissot-lovely-watch-t0581091603100.html",
  "https://www.jomashop.com/mido-watch-m024-630-36-061-00.html",
  "https://www.jomashop.com/mido-multifort-watch-m0384313603100.html",
  "https://www.jomashop.com/mido-watch-m027-407-36-260-00.html",
  "https://www.jomashop.com/hublot-watch-565-nx-7170-lr.html",
  "https://www.jomashop.com/omega-watch-424-13-40-20-03-003.html",
];

(async () => {
  const mdb = {
    host: '127.0.0.1',
    port: 27017,
    user: 'synopsis',
    pass: 'synopsis',
    name: 'synopsis',
    coll: 'p_reference_product',
  };

  const db_url = `mongodb://${mdb.user}:${mdb.pass}@${mdb.host}:${mdb.port}/${mdb.name}`;
  const conn = await MongoClient.connect(db_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const db = conn.db(mdb.name);

  for (let i = 0; i < 1; i++) {
    // for (let i = 0; i < u.length; i++) {
    const p = await db.collection(mdb.coll).find({ url: u[i] }).toArray();
    let d = { ...p[0] }
    console.log('d : ', d)
    for (let j = 1; j < p.length; j++) {
      console.log('p ', j, p[j]);
      d = _.defaultsDeep(d, p[j]);
    }
    console.log()
    console.log('before : ', p[0]);
    console.log('after  : ', d);
  }
  process.exit(0)
})()