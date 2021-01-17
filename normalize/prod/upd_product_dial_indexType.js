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
    let r = await db.collection(mdb.coll).distinct("dial.indexType");
    const updated = []; const noMatch = [];
    for (let i = 0; i < r.length; i++) {
      if (r[i]) {
        let it = Mappers.getIndexType.map(r[i]);
        if (it) {
          if (it !== r[i]) {
            await db.collection(mdb.coll).updateMany(
              { "dial.indexType": r[i] },
              { $set: { "dial.indexType": it } }
            );
            updated.push(it + ' >>> ' + r[i]);
          }
        } else noMatch.push(r[i]);
      }
    }
    console.log('updated : ', updated.length);
    updated.sort();
    updated.forEach(v => console.log(v));
    console.log();
    console.log('no match : ', noMatch.length);
    noMatch.sort();
    noMatch.forEach(v => console.log(v));
  } catch (e) {
    console.log(e);
  }
  process.exit(0);
})();
