const sm = require('./skagen_sm');
const ref = require('./skagen_ref');
const { MessageStation } = require("@cosmos/utils");

(async () => {
  const source = "official";
  const lang = "en";
  const brand = "Skagen";
  const brandID = 240;
  const result = { source, lang, brand, brandID, collections: ['all'], items: { 'all': [] } };

  sm.forEach(v => {
    if (ref.indexOf(v) < 0) {
      const name = $(el).text().trim();
      const u = url.split('/');
      const r = u[u.length - 1].split('-');
      const reference = r[r.length - 1].toUpperCase();
      result.items['all'].push({
        source, lang, brand, brandID, url, name, reference, price: null,
      });
    }
  })

  const mqHost = process.env.MESSAGE_HOST || 'mq.ieplsg.com';
  const mqUser = process.env.MESSAGE_USER || 'synopsis';
  const mqPass = process.env.MESSAGE_PASS || '2rbrwWwwEErLwRCMrJUZ';
  const mqVhost = process.env.MESSAGE_VHOST || '/cs';
  const station = await MessageStation
    .connect({
      host: mqHost,
      user: mqUser,
      pass: mqPass,
      vhost: mqVhost
    });

  const channel = await station.createChannel();

  await channel.publish(
    'scraper',
    'collector',
    Buffer.from(JSON.stringify(payload)),
    { correlationId: shortid.generate() });

})();
