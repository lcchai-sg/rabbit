const { MongoClient } = require('mongodb');
const { Mappers } = require('./utils');

const sameMaterials = (arr1, arr2) => {
  if (arr1.length !== arr2.length) return false;
  arr1.forEach(v => {
    if (arr2.indexOf(v) < 0) return false;
  })
  return true;
}

(async () => {
  try {
    const mdb = {
      // host: '203.118.42.106',  // dev
      host: '127.0.0.1',  //local
      port: 27017,
      user: "synopsis",
      pass: "synopsis",
      name: "synopsis",
      coll: "product",
    }
    const db_url = `mongodb://${mdb.user}:${mdb.pass}@${mdb.host}:${mdb.port}/${mdb.name}`;
    const conn = await MongoClient.connect(db_url, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    const db = conn.db(mdb.name);
    const r = await db.collection(mdb.coll).find({ "band.materials": { $nin: [null, []] } }).toArray();
    const noMatch = []; const rec = [];
    for (let i = 3722; i < r.length; i++) {
      console.log(r.length, i);
      let ms = r[i].band.materials;
      const nms = [];
      if (!Array.isArray(ms)) ms = [ms];
      for (let j = 0; j < ms.length; j++) {
        const { bm, bms, } = Mappers.getMaterial.map(ms[j]);
        if (bm) {
          bms.forEach(v => {
            if (nms.indexOf(v) < 0) nms.push(v);
          })
        } else {
          if (nms.indexOf(ms[j]) < 0) nms.push(ms[j]);
          if (noMatch.indexOf(ms[j]) < 0) noMatch.push(ms[j]);
          rec.push({ id: r[i]._id, m: ms[j] });
        }

      }
      if (!sameMaterials(nms, ms)) {
        console.log('   ', nms, ' >>> ', ms);
        await db.collection(mdb.coll).updateOne(
          { _id: r[i]._id },
          { $set: { "band.materials": nms } }
        );
      }
    }
    console.log();
    console.log('NOT MATCH MATERIALS >>>>>', noMatch.length);
    rec.forEach(v => console.log(v));
    //noMatch.forEach(v => console.log(v));
  } catch (e) {
    console.log(e);
  }
  process.exit(0);
})();
