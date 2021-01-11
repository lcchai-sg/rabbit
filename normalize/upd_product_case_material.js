const { MongoClient } = require('mongodb');
const { getMaterial } = require('./utils/index');

(async () => {
  try {
    const mdb = {
      host: '127.0.0.1',
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
    let r = await db.collection(mdb.coll).distinct("case.material", { lang: "en" });
    for (let i = 0; i < r.length; i++) {
      let { bm, bms, } = getMaterial(r[i]);
      console.log(bm, '>>>>>', r[i])
      console.log(bms, '>>>>>', r[i])
      console.log()
    }
  } catch (e) {
    console.log(e);
  }
  process.exit(0);
})();