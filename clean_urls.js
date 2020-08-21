const { MongoClient } = require('mongodb');

(async () => {
  try {
    const mdb = {
      host: '127.0.0.1',
      port: 27017,
      user: 'synopsis',
      pass: 'synopsis',
      name: 'synopsis',
      coll: 'joma_ref_urls',
    };
    const db_url = `mongodb://${mdb.user}:${mdb.pass}@${mdb.host}:${mdb.port}/${mdb.name}`;
    const conn = await MongoClient.connect(db_url, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    const db = conn.db(mdb.name);

    const bAug = await db.collection(mdb.coll)
      .find({ lastSeenAt: { $lt: new Date("2020-08-01") } })
      .toArray();
    const aftAug = await db.collection(mdb.coll)
      .find({ lastSeenAt: { $gt: new Date("2020-08-01") } })
      .toArray();
    const aAug = aftAug.map(r => r.url);
    for (const r of bAug) {
      if (aAug.indexOf(r.url) >= 0) {
        console.log(r._id, r.url);
      }
    }
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
})();