const { MongoClient } = require('mongodb');
const { MessageStation } = require("@cosmos/utils");
const shortid = require('shortid');

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
  const source = 'official';
  const brandID = 268;
  const strategy = 'bulova';

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

  //for (let i = 0; i < 1; i++) {
  let p = await db.collection('reference_product').distinct("url", {source, brandID});
  let u = await db.collection('reference_urls').distinct("url", {source, brandID});
  for (let i = 0; i < u.length; i++) {
    if (p.indexOf(u[i]) < 0) {
      let r = await db.collection(mdb.coll).find({ url: u[i] }).toArray();
      for (let i = 0; i < r.length; i++) {
        console.log(r[i].url);
        const payload = { ...r[i] };
        delete payload.recordedAt;
        delete payload.lastCheckAt;
        delete payload._id;
        payload.strategy = strategy;
        await channel.publish(
          'scraper',
          'scrape.data.raw',
          Buffer.from(JSON.stringify(payload)),
          { correlationId: shortid.generate() });
      }
    }
  }
  process.exit(0)
})();
