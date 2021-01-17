const { MongoClient } = require('mongodb');
const { Mappers } = require('./utils');

(async () => {
  try {
    const mdb = {
      // host: '203.118.42.106',  // dev
      host: '127.0.0.1',  //local
      port: 27017,
      user: 'synopsis',
      pass: 'synopsis',
      name: 'synopsis',
      coll: 'product',
    };
    const db_url = `mongodb://${mdb.user}:${mdb.pass}@${mdb.host}:${mdb.port}/${mdb.name}`;
    const conn = await MongoClient.connect(db_url, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    const db = conn.db(mdb.name);
    let r = await db.collection(mdb.coll).distinct("band.buckle");
    let noMatch = []; let newB = [];
    for (let i = 0; i < r.length; i++) {
      if (r[i]) {
        const bb = Mappers.getBuckle.map(r[i]);
        if (bb) {
          if (bb !== r[i]) {
            newB.push(bb + ' >>> ' + r[i]);
            await db.collection(mdb.coll).updateMany(
              { "band.buckle": r[i] },
              { $set: { "band.buckle": bb } }
            );
          }
        } else {
          if (noMatch.indexOf(r[i]) < 0) noMatch.push(r[i]);
        }
      }
    }
    console.log('update : ', newB.length);
    newB.sort();
    newB.forEach(v => { console.log(v); });
    console.log();
    console.log('no match : ', noMatch.length);
    noMatch.sort();
    noMatch.forEach(v => { console.log(v); });
  } catch (e) {
    console.log(e);
  }
  process.exit(0);
})();
