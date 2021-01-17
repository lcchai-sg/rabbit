const { MongoClient } = require('mongodb');
const { Mappers } = require('./utils');


const sameArray = (arr1, arr2) => {
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
    const noMatch = []; const updated = [];
    for (let i = 0; i < r.length; i++) {
      console.log(r.length, i, r[i]._id, r[i].band.materials);
      const ms = r[i].band.materials;
      const nms = [];
      for (let j = 0; j < ms.length; j++) {
        const { bms, } = Mappers.getMaterial.map(ms[j]);
        console.log('           ', bms)
        if (bms.length > 0) {
          console.log('..........nms..........')
          bms.forEach(v => {
            if (nms.indexOf(v) < 0) nms.push(v);
          })
        } else {
          if (nms.indexOf(ms[j]) < 0) nms.push(ms[j]);
          if (noMatch.indexOf(ms[j]) < 0) noMatch.push(ms[j]);
        }
      }
      console.log(ms, ' > ', nms);
      if (!sameArray(nms, ms)) {
        await db.collection(mdb.coll).findOneAndUpdate(
          { _id: r[i]._id },
          { $set: { "band.materials": nms } }
        );
        updated.push(nms + ' >>> ' + ms);
      }
    }
    updated.sort();
    console.log('updated : ', updated.length);
    updated.forEach(v => console.log(v));
    noMatch.sort();
    console.log('no match : ', noMatch.length);
    noMatch.forEach(v => console.log(v));
  } catch (e) {
    console.log(e);
  }
  process.exit(0);
})();
