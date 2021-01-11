const { MongoClient } = require('mongodb');
const { Mappers, material_zh, } = require('./utils');

(async () => {
  try {
    const mdb = {
      host: "203.118.42.106",
      port: 27017,
      user: "synopsis",
      pass: "synopsis",
      name: "synopsis",
      coll: "product_zh",
    }
    const db_url = `mongodb://${mdb.user}:${mdb.pass}@${mdb.host}:${mdb.port}/${mdb.name}`;
    const conn = await MongoClient.connect(db_url, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    const db = conn.db(mdb.name);
    const r = await db.collection(mdb.coll).find({ "band.materials": { $nin: [null, []] } }).toArray();
    const noTrans = [];
    for (let i = 0; i < r.length; i++) {
      // console.log(r.length, i);
      const ms = r[i].band.materials;
      const nms = [];
      for (let j = 0; j < ms.length; j++) {
        const tm = material_zh[ms[j]] ? material_zh[ms[j]] : ms[j];
        if (!material_zh[ms[j]]) {
          if (noTrans.indexOf(ms[j]) < 0) {
            noTrans.push(ms[j]);
          }
        }
        nms.push(tm);
      }
      console.log(ms, ' > ', nms);
      await db.collection(mdb.coll).updateOne(
        { _id: r[i]._id }, 
        { $set: { "band.materials": nms } }
      );
    }
    console.log();
    console.log('NO TRANSLATION: ', noTrans.length);
    noTrans.forEach(v => console.log(v));
  } catch (e) {
    console.log(e);
  }
  process.exit(0);
})();
