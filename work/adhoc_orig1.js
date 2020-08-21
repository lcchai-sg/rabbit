const { MongoClient } = require('mongodb');
const { MessageStation, timeout } = require("@cosmos/utils");
const joma = require('./joma');

(async function () {
  const mqHost = process.env.MESSAGE_HOST || 'vulture.rmq.cloudamqp.com';
  const mqUser = process.env.MESSAGE_USER || 'kswsdxln';
  const mqPass = process.env.MESSAGE_PASS || 'ZsZJndMGqhVPo-hxbJ-Tg9Y-Mn18TGCP';
  const mqVhost = process.env.MESSAGE_VHOST || 'kswsdxln';
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
  const st = 10000;
  const ed = 15000;
  const targets = joma;
  const ps = [];
  for (let i=st; i<ed; i++) {
    // for (const target of targets) {
    const p = messenger
      .request("crawler", {
        dryRun: false,
        payload: {
          strategy: "jomashop",
          command: "extraction",
          context: {
            entry: targets[i].url,
            brand: targets[i].brand,
            brandID: targets[i].brandID,
            productID: targets[i].productID,
            lang: targets[i].lang,
            collection: targets[i].collection,
            price: targets[i].price,
            thumbnail: targets[i].thumbnail,
            retail: targets[i].retail,
            gender: targets[i].gender,
          }
        }
      }, { replyTo: "distiller" })
      .then((result) => {
        // update data
        const { url, code, } = result;
        console.debug('url:', url, 'code:', code,);
      });
    ps.push(p);
    await timeout(interval);
  }
  await Promise.all(ps);
})();
