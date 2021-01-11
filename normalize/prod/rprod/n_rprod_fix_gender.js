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
    const r = await db.collection(mdb.coll).find({gender: null}).toArray();
    for (let i = 0; i < r.length; i++) {
      if (r[i].name) {
        const c = Mappers.getGender.map(r[i].name);
        const cc = Mappers.getGender.map(r[i].url);
        const g = c ? c : cc ? cc : null;
        if (g) {
          console.log(r[i].name, ' > ', g);
          await db.collection(mdb.coll).updateOne(
            { _id: r[i]._id }, 
            { $set: { "gender": g, } }
          );
        }
      }
    }
  } catch (e) {
    console.log(e);
  }
  process.exit(0);
})();
