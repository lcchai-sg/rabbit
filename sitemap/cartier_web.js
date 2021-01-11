const axios = require('axios');
const { MongoClient } = require('mongodb');

(async () => {
  const urls = [
    "https://www.cartier.com/en-us/collections/watches/women-s-watch.productlistingservletv2.json",
    "https://www.cartier.com/en-us/collections/watches/mens-watches.productlistingservletv2.json",
  ];
  const mdb = {
    user: 'synopsis',
    pass: 'synopsis',
    port: 27017,
    name: 'synopsis',
    host: '127.0.0.1',
    coll: 'cartier_prod',
  };

  const db_url = `mongodb://${mdb.user}:${mdb.pass}@${mdb.host}:${mdb.port}/${mdb.name}`;
  const conn = await MongoClient.connect(db_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const db = conn.db(mdb.name);

  const base = "https://www.cartier.com";
  for (let i = 0; i < urls.length; i++) {
    const j = (await axios.get(urls[i])).data;
    for (let k = 0; k < j.listing.all.length; k++) {
      console.log(j.listing.all.length, k)
      let result = {};
      let f = base + j.listing.all[k].pdpURL;
      let r = await db.collection(mdb.coll).find({ url: f }).toArray();
      if (r.length <= 0) {
        result.reference = j.listing.all[k].reference;
        result.name = j.listing.all[k].productNameEN;
        result.desc = j.listing.all[k].desc;
        result.collection = j.listing.all[k].productCollectionEN;
        result.price = j.listing.all[k].priceFormatted;
        result.thumbnail = base + j.listing.all[k].image;
        result.url = f;
        result.gender = j.listing.all[k].filter.Gender[0].match(/her/i) ? 'F' : 'M';

        await db.collection(mdb.coll).insertOne(result);
        console.log('>>>>> inserted >>>>>', result);
      }
    }
  }
})();