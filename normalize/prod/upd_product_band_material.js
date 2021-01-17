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
    const r = await db.collection(mdb.coll).distinct("band.material");
    const newB = []; const oldB = [];
    for (let i = 0; i < r.length; i++) {
      if (r[i]) {
        const { bm, } = Mappers.getMaterial.map(r[i]);
        if (bm) {
          if (bm !== r[i]) {
            newB.push(bm + ' >>> ' + r[i]);
            await db.collection(mdb.coll).updateMany(
              { "band.material": r[i] },
              { $set: { "band.material": bm } }
            );
          }
        } else oldB.push(r[i]);
      }
    }
    console.log('new replace: ', newB.length);
    newB.sort();
    newB.forEach(v => { console.log(v); });
    console.log();
    console.log('not replace: ', oldB.length);
    oldB.sort();
    oldB.forEach(v => { console.log(v); });
  } catch (e) {
    console.log(e);
  }
  process.exit(0);
})();
