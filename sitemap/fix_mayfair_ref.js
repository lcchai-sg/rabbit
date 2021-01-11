const { MessageStation } = require("@cosmos/utils");
const shortid = require('shortid');
const { Mappers } = require('./utils');

const u =
  [
    "https://watchesofmayfair.com/brand/grand-seiko/grand-seiko-automatic-hi-beat-36000-sbgh005",
    "https://watchesofmayfair.com/brand/vacheron-constantin/all-vacheron-constantin-watches/vacheron-constantin-metiers-d-art-mecaniques-ajourees-jewellery-82620-000g-9924",
    "https://watchesofmayfair.com/brand/vacheron-constantin/malte-collection/vacheron-constantin-malte-high-jewellery-small-model-81610-000g-b007",
    "https://watchesofmayfair.com/brand/vacheron-constantin/traditionnelle-collection/vacheron-constantin-traditionnelle-high-jewellery-medium-model-81760-000g-9862",
    "https://watchesofmayfair.com/brand/vacheron-constantin/malte-collection/vacheron-constantin-malte-tourbillon-high-jewellery-30630-000g-9899",
    "https://watchesofmayfair.com/brand/vacheron-constantin/malte-collection/vacheron-constantin-malte-tourbillon-high-jewellery-30630-s22g-9899",
    "https://watchesofmayfair.com/brand/vacheron-constantin/traditionnelle-collection/vacheron-constantin-traditionnelle-high-jewellery-82760-000g-9852",
    "https://watchesofmayfair.com/brand/vacheron-constantin/traditionnelle-collection/vacheron-constantin-traditionnelle-high-jewellery-medium-model-81761-qb1g-9862",
  ];

(async () => {
  const source = "watchesofmayfair";
  const lang = "en";
  let payload = { source, lang, collections: ['all'], items: { 'all': [], } };
  for (let i = 0; i < u.length; i++) {
    // console.log(i, u[i])
    const { id: brandID, name: brand } = Mappers.generateBrandID.map(u[i]);
    let d = u[i].split('/');
    payload.items['all'].push({
      source, lang, brand, brandID, url: u[i], name: d[d.length - 1],
      reference: d[d.length - 1], price: null,
    });
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
