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
    let r = await db.collection(mdb.coll).distinct("band.type");
    for (let i = 0; i < r.length; i++) {
      if (r[i]) {
        const bt = Mappers.getBandType.map(r[i]);
        let nb = '';
        if (bt) nb = bt; else { // cannot get bt
          const { bt, } = Mappers.getMaterial.map(r[i]);
          if (bt) nb = bt; else nb = r[i];
        }
        console.log(nb, ' > ', r[i]);
        await db.collection(mdb.coll).updateMany(
          { "band.type": r[i] },
          { $set: { "band.type": nb } }
        );
      }
    }
  } catch (e) {
    console.log(e);
  }
  process.exit(0);
})();
