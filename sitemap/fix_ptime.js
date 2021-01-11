const { MessageStation } = require("@cosmos/utils");
const shortid = require('shortid');
const { Mappers } = require('./utils');
const u = require('./ptime_missed');

(async () => {
  const source = 'prestigetime';
  const lang = 'en';
  let payload = { source, lang, collections: ['all'], items: { 'all': [], } };

  for (let i = 0; i < u.length; i++) {
    console.log(u.length, i, u[i]);
    try {
      let { id: brandID, name: brand } = Mappers.generateBrandID.map(u[i]);

      let collection = '';
      let v = u[i].split('/');
      if (u[i].match(/item/i)) {
        // https://www.prestigetime.com/item/<brand>/<collection>/<name?reference>.html
        collection = v[v.length - 2];
        // https://www.prestigetime.com/<brand><collection?name?reference>.html
      }
      payload.items['all'].push({
        source, lang, brand, brandID, url: u[i],
        name: v[v.length - 1].replace('.html', '').replace(new RegExp('-', 'g'), ' '),
        reference: v[v.length - 1].replace('.html', '').replace(new RegExp('-', 'g'), '.'),
        collection, price: null,
      });
    } catch (e) {
      console.log(e);
    }
  }

  // console.log(payload);
  console.log(payload.items['all']);
  console.log('>>>>>', payload.items['all'].length);
  // /*
  //production
  const mqHost = process.env.MESSAGE_HOST || 'mq.ieplsg.com';
  const mqUser = process.env.MESSAGE_USER || 'synopsis';
  const mqPass = process.env.MESSAGE_PASS || '2rbrwWwwEErLwRCMrJUZ';
  const mqVhost = process.env.MESSAGE_VHOST || '/cs';
  //
  //localhost
  // const mqHost = process.env.MESSAGE_HOST || '127.0.0.1';
  // const mqUser = process.env.MESSAGE_USER || 'synopsis';
  // const mqPass = process.env.MESSAGE_PASS || 'synopsis';
  // const mqVhost = process.env.MESSAGE_VHOST || '/lc';

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
  // */

  process.exit(0);
})();
