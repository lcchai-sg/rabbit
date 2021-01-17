const { MongoClient } = require('mongodb');
const { Mappers } = require('./utils');

(async () => {
  try {
    const mdb = {
      // host: '203.118.42.106',  // dev
      host: '127.0.0.1',  //local
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
    let r = await db.collection(mdb.coll).distinct("case.crystal");
    const updatedC = []; const updatedCC = []; const noMatch = [];
    for (let i = 0; i < r.length; i++) {
      if (r[i]) {
        let dd = Mappers.getCrystal.map(r[i]);
        let cc = Mappers.getCrystalCoating.map(r[i]);
        if (cc) {
          await db.collection(mdb.coll).updateMany(
            { "case.crystal": r[i] },
            { $set: { "case.crystalCoating": cc } }
          );
          updatedCC.push(cc + ' >>> ' + r[i]);
        }
        if (dd) {
          await db.collection(mdb.coll).updateMany(
            { "case.crystal": r[i] },
            { $set: { "case.crystal": dd } }
          );
          updatedC.push(dd + ' >>> ' + r[i]);
        } else noMatch.push(r[i]);
      }
    }
    console.log('updatedC : ', updatedC.length);
    updatedC.sort();
    updatedC.forEach(v => console.log(v));
    console.log();
    console.log('updatedCC : ', updatedCC.length);
    updatedCC.sort();
    updatedCC.forEach(v => console.log(v));
    console.log();
    console.log('no match : ', noMatch.length);
    noMatch.sort();
    noMatch.forEach(v => console.log(v));
  } catch (e) {
    console.log(e);
  }
  process.exit(0);
})();
