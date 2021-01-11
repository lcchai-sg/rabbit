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
    let r = await db.collection(mdb.coll).distinct("caliber.calendar");
    for (let i = 0; i < r.length; i++) {
      if (r[i]) {
        let dd = Mappers.getCalendar.map(r[i]);
        const c = dd ? dd : r[i];
        console.log(c, ' > ', r[i]);
        await db.collection(mdb.coll).updateMany(
          { "caliber.calendar": r[i] },
          { $set: { "caliber.calendar": dd } }
        );
      }
    }
  } catch (e) {
    console.log(e);
  }
  process.exit(0);
})();
