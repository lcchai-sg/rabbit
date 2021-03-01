const { MongoClient } = require('mongodb');
const { MessageStation } = require("@cosmos/utils");
const shortid = require('shortid');

const urls = [
  "https://www.jomashop.com/rolex-yacht-master-ii-116681waso.html"
];

(async () => {
  const mdb = {
    // production
    //host: '192.168.200.227',
    //port: 27017,
    //user: 'productManager',
    //pass: 'UInJRX7m',
    //name: 'synopsis',
    //coll: 'reference_raw',
    // local
    host: '127.0.0.1',
    port: 27017,
    user: 'synopsis',
    pass: 'synopsis',
    name: 'synopsis',
    coll: 'reference_raw',
  };

  // update data here
  const source = 'jomashop';
  const brandID = 252;
  const strategy = 'jomashop';

  const db_url = `mongodb://${mdb.user}:${mdb.pass}@${mdb.host}:${mdb.port}/${mdb.name}`;
  const conn = await MongoClient.connect(db_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const db = conn.db(mdb.name);

  // production
  //const mqHost = process.env.MESSAGE_HOST || 'mq.ieplsg.com';
  //const mqUser = process.env.MESSAGE_USER || 'synopsis';
  //const mqPass = process.env.MESSAGE_PASS || '2rbrwWwwEErLwRCMrJUZ';
  //const mqVhost = process.env.MESSAGE_VHOST || '/cs';
  // local
  const mqHost = process.env.MESSAGE_HOST || '127.0.0.1';
  const mqUser = process.env.MESSAGE_USER || 'synopsis';
  const mqPass = process.env.MESSAGE_PASS || 'synopsis';
  const mqVhost = process.env.MESSAGE_VHOST || '/lc';

  const station = await MessageStation
    .connect({
      host: mqHost,
      user: mqUser,
      pass: mqPass,
      vhost: mqVhost
    });

  const channel = await station.createChannel();

  for (let i = 0; i < urls.length; i++) {
    console.log(urls.length, i, urls[i]);
    const r = await db.collection(mdb.coll).find({ url: urls[i], }).toArray();
    console.log('r.length ', r.length)
    if (r.length > 0) {
      const payload = { ...r[0] };
      delete payload.recordedAt;
      delete payload.lastCheckAt;
      delete payload._id;
      payload.strategy = strategy;
      await channel.publish(
        'scraper',
        'scrape.data.raw',
        Buffer.from(JSON.stringify(payload)),
        { correlationId: shortid.generate() });

      await new Promise(r => setTimeout(r, 1000));
    }
  }

  process.exit(0)
})();
