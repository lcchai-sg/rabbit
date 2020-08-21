const { Logger } = require('@cosmos/logger');
const { MessageStation } = require("@cosmos/utils");
const shortid = require('shortid');

const logger = Logger.getLogger('cs:syno:urls', 'debug');
(async function () {
  logger.info('Scraper');
  const mqHost = process.env.MESSAGE_HOST;
  const mqUser = process.env.MESSAGE_USER;
  const mqPass = process.env.MESSAGE_PASS;
  const mqVhost = process.env.MESSAGE_VHOST;
  const station = await MessageStation
    .connect({
      host: mqHost,
      user: mqUser,
      pass: mqPass,
      vhost: mqVhost
    });

  const channel = await station.createChannel();

  const jobs = [
    // {
    //   "dryRun": false,
    //   "payload": {
    //     "base": "https://www.hamiltonwatch.com/en-us",
    //     "strategy": "hamilton",
    //     "command": "newIndexing",
    //     "context": {
    //       "entry": "https://www.hamiltonwatch.com/pub/mediam2/sitemap/sitemap_en_us.xml",
    //       "brand": "hamilton",
    //       "brandID": 62,
    //       "lang": "en"
    //     }
    //   }
    // },
    {
      "dryRun": false,
      "payload": {
        "brandID": 62,
        "brand": "hamilton",
        "interval": 3000,
        "lang": "en",
        "source": "official"
      }
    }
  ];

  for (const job of jobs) {
    logger.debug('Start Jobs', job.payload.strategy);
    await channel.publish(
      'scraper',
      'origin',
      Buffer.from(JSON.stringify(job)),
      { replyTo: 'scrape.data.raw', correlationId: shortid.generate() });
  }

  process.exit(0)

})();