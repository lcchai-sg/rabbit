const { MongoClient } = require('mongodb');
const urls = require('./cl_urls');

(async () => {
  try {
    const mdb = {
      // host: "203.118.42.106",
      host: "127.0.0.1",
      port: 27017,
      user: "synopsis",
      pass: "synopsis",
      name: "synopsis",
      coll: "reference_urls",
    }
    const db_url = `mongodb://${mdb.user}:${mdb.pass}@${mdb.host}:${mdb.port}/${mdb.name}`;
    const conn = await MongoClient.connect(db_url, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    const db = conn.db(mdb.name);
    for (let i = 0; i < urls.length; i++) {
      console.log(urls.length, i, urls[i]);
      const r = await db.collection(mdb.coll).find({ url: urls[i] }).toArray();
      const p = r[0];
      for (let j = 1; j < r.length; j++) {
        if (p.brand && r[j].brand && p.brand !== r[j].brand)
          p.brand = r[j].brand;
        if (p.brandID && r[j].brandID && p.brandID !== r[j].brandID)
          p.brandID = r[j].brandID;
        if (p.name && r[j].name && p.name !== r[j].name && p.name.length < r[j].name.length)
          p.name = r[j].name;
        if (p.reference && r[j].reference && p.reference !== r[j].reference && p.reference.length < r[j].reference.length)
          p.reference = r[j].reference;
        if (p.collection && r[j].collection && p.collection !== r[j].collection)
          p.collection = r[j].collection;
        if (p.lastSeenAt < r[j].lastSeenAt && p.extracted && r[j].extracted)
          console.log('***** not latest *****')
        // remove record
        await db.collection(mdb.coll).deleteOne({ _id: r[j]._id });
      }
      const { id, lang, source, brand, brandID, name, collection, thumbnail, reference, } = p;
      await db.collection(mdb.coll).findOneAndUpdate(
        { id, lang, source, },
        {
          $set: {
            brand, brandID, name, reference, thumbnail, collection,
          },
        },
      )
    }
  } catch (e) {
    console.log(e);
  }
  console.log()
  console.log('***** DONE *****');
  process.exit(0);
})();