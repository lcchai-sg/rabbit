const shortid = require('shortid');
const { MessageStation } = require("@cosmos/utils");
const { cfg, qCfg } = require('./subjob-list');

(async function () {
  let args = process.argv.slice(2);
  if (!(args.length >= 2)) {
    console.error("require at least 2 arguments");
    console.error("brandID, action, url");
    console.error();
    console.error("action - indexing / extraction / product")
    console.error("brandID either numbers, or 'joma' - jomashop, 'ptime' - prestigetime, 'mayfair' - watchesofmayfair, 'watchmaxx' - watchmaxx, 'kechiq' - kechiq");
    console.error("url - required when action is 'product'")
    process.exit(1);
  }

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

  const brandID = args[0];
  const action = args[1];
  const url = args.length === 3 ? args[2] : null;
  if (!cfg[brandID]) {
    console.log(brandID, ' >>> NO CONFIGURATION FOUND');
    process.exit(0)
  }
  const lang = "en";
  const source = brandID.match(/joma|ptime|mayfair|watchmaxx|kechiq/i) ? brandID : "official";
  const base = brandID.match(/joma|ptime|mayfair|watchmaxx|kechiq/i) ? null : cfg[brandID] ? cfg[brandID].base : null;
  const indexJob = {
    "dryRun": false,
    "payload": {
      base,
      "strategy": cfg[brandID].strategy,
      "command": action,
      "context": {
        source,
        "entry": cfg[brandID].entry,
        "brand": cfg[brandID].brand,
        brandID,
        lang,
      }
    }
  };
  const extractJob = {
    "dryRun": false,
    "payload": {
      "strategy": cfg[brandID].strategy,
      brandID,
      "brand": cfg[brandID].brand,
      "interval": 3000,
      lang,
      source,
    }
  };
  const productJob = {
    dryRun: false,
    payload: {
      strategy: cfg[brandID].strategy,
      command: action,
      context: {
        entry: url,
        brand: cfg[brandID].brand,
        brandID,
        lang,
        source,
      }
    }
  };

  const job = action === 'indexing' ? indexJob : action === 'extraction' ? extractJob : productJob;
  console.log(brandID, action, job);
  console.log({
    ex: qCfg[action].exchange,
    route: qCfg[action].route,
    replyTo: qCfg[action].replyTo,
  });

  await channel.publish(
    qCfg[action].exchange,
    qCfg[action].route,
    Buffer.from(JSON.stringify(job)),
    { replyTo: qCfg[action].replyTo, correlationId: shortid.generate() }
  );
  //   // indexing 
  // await channel.publish(
  //   'scraper',
  //   'crawler',
  //   Buffer.from(JSON.stringify(job)),
  //   { replyTo: 'collector', correlationId: shortid.generate() });

  // extraction for product
  // await channel.publish(
  //   'scraper',
  //   'crawler',
  //   Buffer.from(JSON.stringify(job)),
  //   { replyTo: 'scrape.data.raw', correlationId: shortid.generate() });

  // originator -> extraction
  // await channel.publish(
  //   'scraper',
  //   'origin',
  //   Buffer.from(JSON.stringify(job)),
  //   { replyTo: 'scrape.data.raw', correlationId: shortid.generate() });

  process.exit(0)

})();
