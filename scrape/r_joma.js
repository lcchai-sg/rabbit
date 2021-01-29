const joma_urls = require('./r_joma_urls');
const { MessageStation } = require("@cosmos/utils");
const shortid = require('shortid');

(async function () {
  const mqHost = process.env.MESSAGE_HOST;
  const mqUser = process.env.MESSAGE_USER;
  const mqPass = process.env.MESSAGE_PASS;
  const mqVhost = process.env.MESSAGE_VHOST;
  const station = await MessageStation
    .connect({
      host: 'mq.ieplsg.com',
      user: 'synopsis',
      pass: '2rbrwWwwEErLwRCMrJUZ',
      vhost: '/cs',
    });

  const channel = await station.createChannel();

  for (let i = 4588; i < joma_urls.length; i++) {
    const job = {
      dryRun: false,
      payload: {
        strategy: "jomashop",
        command: "extraction",
        context: {
          entry: joma_urls[i],
          lang: "en",
          source: "jomashop",
        }
      }
    };

    await channel.publish(
      'scraper',
      'crawler',
      Buffer.from(JSON.stringify(job)),
      { replyTo: 'scrape.data.raw', correlationId: shortid.generate() });

    console.log(i, 'submitted >', job);
    await new Promise(r => setTimeout(r, 10000));
  }
  process.exit(0);
})();
