const { MongoClient } = require('mongodb');
const { Mappers } = require('./utils');

(async () => {
  try {
    const mdb = {
      host: '203.118.42.106',
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
    let r = await db.collection(mdb.coll).distinct("case.crystal");
    for (let i = 0; i < r.length; i++) {
      if (r[i]) {
        let dd = Mappers.getCrystal.map(r[i]);
        let cc = Mappers.getCrystalCoating.map(r[i]);
        if (cc) {
          console.log('co: ', cc, ' > ', r[i]);
          await db.collection(mdb.coll).updateMany(
            { "case.crystal": r[i] },
            { $set: { "case.crystalCoating": cc } }
          );
        }
        if (dd) {
          console.log('cr: ', dd, ' > ', r[i]);
          await db.collection(mdb.coll).updateMany(
            { "case.crystal": r[i] },
            { $set: { "case.crystal": dd } }
          );
        }
      }
    }
  } catch (e) {
    console.log(e);
  }
  process.exit(0);
})();
