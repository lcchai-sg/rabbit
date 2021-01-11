const { MongoClient } = require('mongodb');
const { Mappers } = require('./utils/index');

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
    let r = await db.collection(mdb.coll).distinct("case.crown");
    for (let i = 0; i < r.length; i++) {
      if (r[i]) {
        let dd = Mappers.getCaseCrown.map(r[i]);
        const cc = dd ? dd : r[i];
        console.log(cc, ' > ', r[i]);
        await db.collection(mdb.coll).updateMany(
          { "case.crown": r[i] },
          { $set: { "case.crown": cc } }
        );
      }
    }
  } catch (e) {
    console.log(e);
  }
  process.exit(0);
})();
