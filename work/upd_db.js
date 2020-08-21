const { MessageStation } = require("@cosmos/utils");
const { MongoClient } = require('mongodb');

(async function () {
  console.debug('Scraper');
  const mqHostS = process.env.MESSAGE_HOST || 'vulture.rmq.cloudamqp.com';
  const mqUserS = process.env.MESSAGE_USER || 'kswsdxln';
  const mqPassS = process.env.MESSAGE_PASS || 'ZsZJndMGqhVPo-hxbJ-Tg9Y-Mn18TGCP';
  const mqVhostS = process.env.MESSAGE_VHOST || 'kswsdxln';
  const stationS = await MessageStation
    .connect({
      host: mqHostS,
      user: mqUserS,
      pass: mqPassS,
      vhost: mqVhostS,
    });

  // const mqHostT = process.env.MESSAGE_HOST || 'mq.ieplsg.com';
  // const mqUserT = process.env.MESSAGE_USER || 'synopsis';
  // const mqPassT = process.env.MESSAGE_PASS || '2rbrwWwwEErLwRCMrJUZ';
  // const mqVhostT = process.env.MESSAGE_VHOST || '/cs';
  // const stationT = await MessageStation
  //   .connect({
  //     host: mqHostT,
  //     user: mqUserT,
  //     pass: mqPassT,
  //     vhost: mqVhostT,
  //   });


  // const channel = await station.createChannel();
  // const messenger = await stationS.createMessenger({
  //   exchange: 'scraper',
  //   exType: 'topic',
  //   route: 'imaging',
  //   queue: 'scraper-image1'
  // });

  const mdb = {
    user: "synopsis",
    pass: "synopsis",
    host: "127.0.0.1",
    port: 27017,
    name: "synopsis",
  }
  const db_url = `mongodb://${mdb.user}:${mdb.pass}@${mdb.host}:${mdb.port}/${mdb.name}`;
  const conn = await MongoClient.connect(db_url, { useNewUrlParser: true, useUnifiedTopology: true, });
  const db = conn.db(mdb.name);
  const client = await stationS.createClient({
    exchange: 'scraper',
    exType: 'topic',
    route: 'imaging',
    queue: 'scraper-image4',
    timeout: 900000,
    handler: async message => {
      // const { correlationId, replyTo } = message.properties;
      const payload = JSON.parse(message.content);
      const { url, thumbnail, assets, } = payload;
      console.log(url, thumbnail, assets);
      return await db.collection('reference_product')
        .updateOne({ source: "jomashop", url }, { $set: { thumbnail, assets } });
      ;
    }
  });
})();