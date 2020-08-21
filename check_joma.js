const axios = require('axios');
const cheerio = require('cheerio');
const { MongoClient } = require('mongodb');

(async () => {
  try {
    const mdb = {
      host: '127.0.0.1',
      port: 27017,
      user: 'synopsis',
      pass: 'synopsis',
      name: 'synopsis',
      coll: 'reference_urls',
    };
    const db_url = `mongodb://${mdb.user}:${mdb.pass}@${mdb.host}:${mdb.port}/${mdb.name}`;
    const conn = await MongoClient.connect(db_url, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    const db = conn.db(mdb.name);
    let data = await db.collection(mdb.coll)
      .find({ source: "jomashop", product: { $exists: false } })
      .toArray();
    for (let i = 0; i < data.length; i++) {
      console.log(data[i].url);
      let d = (await axios.get(data[i].url)).data;
      let $ = cheerio.load(d);
      const w = $('#attribute-id-category').text();
      if (w.match(/watch/i)) {
        // update reference_urls with product = true
        await db.collection(mdb.coll).update({ _id: data[i]._id }, { $set: { product: true } });
      } else {
        // update reference_urls with product = false
        await db.collection(mdb.coll).update({ _id: data[i]._id }, { $set: { product: false } });
      }
      await new Promise(r => setTimeout(r, 5000));
    }
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
})();