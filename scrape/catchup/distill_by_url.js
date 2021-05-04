const { MongoClient } = require('mongodb');
const { MessageStation } = require("@cosmos/utils");
const shortid = require('shortid');

const urls = [
"https://shop.ballwatch.ch/en/Racer_Chronograph?model=CM2198C-S1CJ-BE",
"https://shop.ballwatch.ch/en/DC3030C-S1-BE",
"https://shop.ballwatch.ch/en/DC3030C-S1-WH",
"https://shop.ballwatch.ch/en/Archangel-DD3072B-P1CJ-BE",
"https://shop.ballwatch.ch/en/Archangel-DD3072B-P1CJ-BK",
"https://shop.ballwatch.ch/en/MSkindiverHeritage?model=DD3208B-P1C-BE",
"https://shop.ballwatch.ch/en/MSkindiverHeritage?model=DD3208B-P1C-BK",
"https://shop.ballwatch.ch/en/MSkindiverHeritage?model=DD3208B-S1C-BE",
"https://shop.ballwatch.ch/en/MSkindiverHeritage?model=DD3208B-S1C-BK",
"https://shop.ballwatch.ch/en/Aero_GMT_II-DG2018C-S7C-BE",
"https://shop.ballwatch.ch/en/Aero_GMT_II-DG2018C-S7C-BK",
"https://shop.ballwatch.ch/en/Aero_GMT_II-DG2118C-S7C-BE",
"https://shop.ballwatch.ch/en/Aero_GMT_II-DG2118C-S7C-BK",
"https://shop.ballwatch.ch/en/Marine_GMT-DG3030B-S1CJ-BE",
"https://shop.ballwatch.ch/en/Marine_GMT-DG3030B-S1CJ-BK",
"https://shop.ballwatch.ch/en/Marine_GMT-DG3030B-S2C-BK",
"https://shop.ballwatch.ch/en/Marine_GMT-DG3030B-S2C-GR",
"https://shop.ballwatch.ch/en/Marine_GMT-DG3030B-S3C-BK",
"https://shop.ballwatch.ch/en/Marine_GMT-DG3030B-S3C-BR",
"https://shop.ballwatch.ch/en/Marine_GMT-DG3030B-S4C-BE",
"https://shop.ballwatch.ch/en/Marine_GMT-DG3030B-S4C-BK",
"https://shop.ballwatch.ch/en/Marine_GMT-DG3030B-S5C-BK",
"https://shop.ballwatch.ch/en/Marine_GMT-DG3030B-S5C-GR",
"https://shop.ballwatch.ch/en/Marine_GMT-DG3030B-S6CJ-BE",
"https://shop.ballwatch.ch/en/Marine_GMT-DG3030B-S6CJ-BK",
"https://shop.ballwatch.ch/en/Marine_GMT-DG3030B-S6CJ-WH",
"https://shop.ballwatch.ch/en/Pilot_GMT-DG3030A-S6C-BE",
"https://shop.ballwatch.ch/en/Pilot_GMT-DG3030A-S6C-BK",
"https://shop.ballwatch.ch/en/Pilot_GMT-DG3030A-S6C-WH",
"https://shop.ballwatch.ch/en/DM2218B-Original?model=DM2218B-PCJ-BK",
"https://shop.ballwatch.ch/en/DM2218B-Original?model=DM2218B-SCJ-BK",
"https://shop.ballwatch.ch/en/Submarine - DM2276A[bracelet][dial]?model=DM2276A-PCJ-BK",
"https://shop.ballwatch.ch/en/Archangel-DM3070B-P1CJ-BE",
"https://shop.ballwatch.ch/en/Archangel-DM3070B-P1CJ-BK",
"https://shop.ballwatch.ch/en/Archangel-DM3130B-S7CJ-BK",
"https://shop.ballwatch.ch/en/Archangel-DM3130B-S7CJ-GR",
"https://shop.ballwatch.ch/en/SkindiverHeritage?model=DM3208B-P1-BE",
"https://shop.ballwatch.ch/en/SkindiverHeritageCOSC?model=DM3208B-P1C-BE",
"https://shop.ballwatch.ch/en/SkindiverHeritage?model=DM3208B-S1-BE",
"https://shop.ballwatch.ch/en/SkindiverHeritageCOSC?model=DM3208B-S1C-BE",
"https://shop.ballwatch.ch/en/Skindiver - DM3308A[bracelet]C-BK?model=DM3308A-P1C-BE",
"https://shop.ballwatch.ch/en/Skindiver - DM3308A[bracelet]C-BK?model=DM3308A-PCJ-BK",
"https://shop.ballwatch.ch/en/Skindiver - DM3308A[bracelet]C-BK?model=DM3308A-S1C-BE",
"https://shop.ballwatch.ch/en/Skindiver - DM3308A[bracelet]C-BK?model=DM3308A-SCJ-BK",
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
    coll: 'p_reference_raw',
  };

  // update data here
  const source = 'official';
  const brandID = 188;
  const strategy = 'tagheuer';

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
    const r = await db.collection(mdb.coll).find({ url: urls[i] }).sort({lastCheckAt:1}).toArray();
    if (r.length > 0) {
      const payload = { ...r[0] };
      delete payload.recordedAt;
      delete payload.lastCheckAt;
      delete payload._id;
      delete payload.code;
      console.log(payload.spec);
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
