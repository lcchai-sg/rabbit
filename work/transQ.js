const { MessageStation } = require("@cosmos/utils");
const shortid = require('shortid');
const { MongoClient } = require('mongodb');

(async function () {
  console.debug('Scraper');
  // amqp://kswsdxln:ZsZJndMGqhVPo-hxbJ-Tg9Y-Mn18TGCP@vulture.rmq.cloudamqp.com/kswsdxln
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
  const messenger = await stationS.createMessenger({
    exchange: 'scraper',
    exType: 'topic',
    route: 'imaging',
    queue: 'scraper-image1'
  });

  const client = await stationS.createClient({
    exchange: 'scraper',
    exType: 'topic',
    route: 'scrape.data.raw',
    queue: 'scraper-data',
    timeout: 900000,
    handler: async message => {
      const { correlationId, replyTo } = message.properties;
      const payload = JSON.parse(message.content);
      console.debug('Operation for', correlationId, 'reply to');
      await messenger.request("imaging", payload, { correlationId });
      return;
    }
  });
})();