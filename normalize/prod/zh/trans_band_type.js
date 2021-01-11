const { MongoClient } = require('mongodb');
const { Mappers, band_zh, } = require('./utils');

(async () => {
  try {
    const mdb = {
      host: '203.118.42.106',
      port: 27017,
      user: 'synopsis',
      pass: 'synopsis',
      name: 'synopsis',
      coll: 'product_zh',
    };
    const db_url = `mongodb://${mdb.user}:${mdb.pass}@${mdb.host}:${mdb.port}/${mdb.name}`;
    const conn = await MongoClient.connect(db_url, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    const db = conn.db(mdb.name);
    const r = await db.collection(mdb.coll).distinct("band.type");
    for (let i = 0; i < r.length; i++) {
      if (r[i]) {
        const dc = band_zh[r[i]] ? band_zh[r[i]] : null;
        if (dc) {
          console.log(r[i], ' > ', dc);
          await db.collection(mdb.coll).updateMany(
            { "band.type": r[i] },
            { $set: { "band.type": dc, } }
          );
        } else {
          console.log('no translation: ', r[i]);
        }
      }
    }
  } catch (e) {
    console.log(e);
  }
  process.exit(0);
})();
