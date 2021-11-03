const { MongoClient } = require('mongodb');
const { MessageStation } = require("@cosmos/utils");
const shortid = require('shortid');

(async () => {
  const mdb = {
    host: '127.0.0.1',
    port: 27017,
    user: 'synopsis',
    pass: 'synopsis',
    name: 'synopsis',
    coll: 'reference_raw',
  };

  const db_url = `mongodb://${mdb.user}:${mdb.pass}@${mdb.host}:${mdb.port}/${mdb.name}`;
  const conn = await MongoClient.connect(db_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const db = conn.db(mdb.name);

  // update the following variables
  const source = "official";
  const brandID = 5;
  const strategy = "montblanc";

  //const mqHost = process.env.MESSAGE_HOST || 'mq.ieplsg.com';
  //const mqUser = process.env.MESSAGE_USER || 'synopsis';
  //const mqPass = process.env.MESSAGE_PASS || '2rbrwWwwEErLwRCMrJUZ';
  //const mqVhost = process.env.MESSAGE_VHOST || '/cs';
  //
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
  let r = [];
  if (source !== 'official' && !brandID) r = await db.collection(mdb.coll).find({source, code:{$nin:[404,'not product']}}).toArray();
  else r = await db.collection(mdb.coll).find({ source, brandID, }).sort({ lastCheckAt: -1 }).toArray();
  console.log('records: ',r.length);
  for (let i=0; i<r.length; i++) {
    console.log(r.length, i, r[i].url);
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

    await new Promise(r => setTimeout(r, 1000));
  }

  process.exit(0)
})();
