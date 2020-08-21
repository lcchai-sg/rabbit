const { MongoClient } = require('mongodb');
const { MessageStation, timeout } = require("@cosmos/utils");
const joma = require('./joma');

(async function () {
  const mqHost = process.env.MESSAGE_HOST || '127.0.0.1';
  const mqUser = process.env.MESSAGE_USER || 'synopsis';
  const mqPass = process.env.MESSAGE_PASS || 'synopsis';
  const mqVhost = process.env.MESSAGE_VHOST || '/lc';
  const db_host = process.env.DB_HOST || '127.0.0.1';
  const db_port = process.env.DB_PORT || 27017;
  const db_user = process.env.DB_USER || 'synopsis';
  const db_pass = process.env.DB_PASS || 'synopsis';
  const db_name = process.env.DB_NAME || 'synopsis';
  const station = await MessageStation
    .connect({
      host: mqHost,
      user: mqUser,
      pass: mqPass,
      vhost: mqVhost
    });
    const messenger = await station.createMessenger({
      exchange: 'scraper',
      exType: 'topic',
      route: 'scrape.data.raw',
      queue: 'scraper-data'
    });
  const db_url = `mongodb://${db_user}:${db_pass}@${db_host}:${db_port}/${db_name}`;
  const conn = await MongoClient.connect(db_url, { useNewUrlParser: true, useUnifiedTopology: true, });

  const interval = 5000;
  const lang = "en";
  const source = "jomashop";

  const targets = joma;
  const ps = [];
  for (const target of targets) {
    const p = messenger
      .request("crawler", {
        dryRun: false,
        payload: {
          strategy: "jomashop",
          command: "extraction",
          context: {
            entry: target.url,
            brand: target.brand,
            brandID: target.brandID,
            productID: target.productID,
            lang: target.lang,
            collection: target.collection,
            price: target.price,
            thumbnail: target.thumbnail,
            retail: target.retail,
            gender: target.gender,
          }
        }
      }, { replyTo: "scrape.data.raw" })
      .then((result) => {
        // update data
        const { url, reference, brandID, brand, subCollection, collection, lang, code, } = result;
        console.debug('Result for Scrape', brand, reference);
        const sets = { reference };
        if (subCollection) sets.subCollection = subCollection;

        return conn.db(db_name)
          .collection('reference_urls')
          .updateOne(
            { url, lang, source, },
            {
              $set: {
                sets,
                code,
                extracted: true,
              }
            });
      });
    ps.push(p);
    await timeout(interval);
  }
  await Promise.all(ps);
})();
