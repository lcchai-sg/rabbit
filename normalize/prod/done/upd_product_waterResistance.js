const { MongoClient } = require('mongodb');
const { Mappers } = require('./utils');

(async function () {
  try {
    const mdb = {
      host: "203.118.42.106",
      port: 27017,
      user: "synopsis",
      pass: "synopsis",
      name: "synopsis",
      coll: "product",
    }
    const db_url = `mongodb://${mdb.user}:${mdb.pass}@${mdb.host}:${mdb.port}/${mdb.name}`;
    const conn = await MongoClient.connect(db_url, { useNewUrlParser: true, useUnifiedTopology: true, });
    const db = conn.db(mdb.name);

    let data = await db.collection(mdb.coll).distinct("waterResistance");

    for (let i = 0; i < data.length; i++) {
      if (data[i]) {
        const wr = Mappers.getWaterResistance.map(data[i]);
        console.log(wr, '>>>>>>>>>>', data[i]);
        if (wr) {
          await db.collection(mdb.coll).updateMany(
            { waterResistance: data[i] },
            { $set: { waterResistance: wr } });
          }
        }
      }
    }
    process.exit(0)
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
})();
