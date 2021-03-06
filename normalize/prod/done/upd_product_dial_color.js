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
    const r = await db.collection(mdb.coll).distinct("dial.color");
    for (let i = 0; i < r.length; i++) {
      if (r[i]) {
        const c = Mappers.getColor.map(r[i]);
        const dc = c ? c : r[i];
        console.log(r[i], ' > ', dc);
        await db.collection(mdb.coll).updateMany(
          { "dial.color": r[i] }, 
          { $set: { "dial.color": dc, "dialColor": dc, } }
        );
      }
    }
  } catch (e) {
    console.log(e);
  }
  process.exit(0);
})();
