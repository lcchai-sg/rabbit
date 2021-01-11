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
      coll: 'reference_product',
    };
    const db_url = `mongodb://${mdb.user}:${mdb.pass}@${mdb.host}:${mdb.port}/${mdb.name}`;
    const conn = await MongoClient.connect(db_url, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    const db = conn.db(mdb.name);
    const r = await db.collection(mdb.coll).distinct("gender");
    for (let i = 0; i < r.length; i++) {
      if (r[i]) {
        const c = Mappers.getGender.map(r[i]);
        if (c) {
          console.log(r[i], ' > ', c);
          await db.collection(mdb.coll).updateMany(
            { "gender": r[i] }, 
            { $set: { "gender": c, } }
          );
        } else {
          console.log(r[i]);
        }
      }
    }
  } catch (e) {
    console.log(e);
  }
  process.exit(0);
})();
