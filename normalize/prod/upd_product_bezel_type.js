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
    let r = await db.collection(mdb.coll).distinct("bezel.type");
    for (let i = 0; i < r.length; i++) {
      if (r[i]) {
        const dd = Mappers.getBezel.map(r[i]);
        const bt = dd ? dd : r[i];
        console.log(bt, ' > ', r[i]);
        await db.collection(mdb.coll).updateMany(
          { "bezel.type": r[i] },
          { $set: { "bezel.type": bt } }
        );
      }
    }
  } catch (e) {
    console.log(e);
  }
  process.exit(0);
})();
