const { MessageStation } = require("@cosmos/utils");
const shortid = require('shortid');

(async function () {
  console.log('Start submitting job');
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

  const config = {
    "hamilton": {
      "source": "official",
      "base": "https://www.hamiltonwatch.com/en-us",
      "command": "newIndexing",
      "entry": "https://www.hamiltonwatch.com/pub/mediam2/sitemap/sitemap_en_us.xml",
      "brand": "hamilton",
      "brandID": 62,
      "interval": 5000,
      "lang": "en",
    },
    "mido": {
      "source": "official",
      "base": "https://www.midowatches.com/us/",
      "command": "newIndexing",
      "entry": "https://www.midowatches.com/us/sitemap.xml",
      "brand": "mido",
      "brandID": 172,
      "interval": 5000,
      "lang": "en",
    },
    "sinn": {
      "source": "official",
      "base": "https://www.sinn.de",
      "command": "indexing",
      "entry": "https://www.sinn.de/en/",
      "brand": "sinn",
      "brandID": 180,
      "interval": 5000,
      "lang": "en",
    },
    "prestigetime": {
      "source": "prestigetime",
      "base": "https://www.prestigetime.com",
      "command": "indexing",
      "entry": 'https://www.prestigetime.com/sitemap.xml',
      "interval": 5000,
      "lang": "en",
    },
    "watchmaxx": {
      "source": "watchmaxx",
      "base": "https://www.watchmaxx.com",
      "command": "indexing",
      "entry": "https://www.watchmaxx.com/sitemap.xml",
      "interval": 5000,
      "lang": "en",
    },
    "mayfair": {
      "source": "watchesofmayfair",
      "base": "https://www.watchesofmayfair.com",
      "command": "indexing",
      "entry": "https://www.watchesofmayfair.com/sitemap.xml",
      "interval": 5000,
      "lang": "en",
    },
    "jomashop": {
      "source": "jomashop",
      "base": "https://www.jomashop.com",
      "command": "indexing",
      "entry": "https://www.jomashop.com/sitemap.xml",
      "interval": 5000,
      "lang": "en",
    },
  }

  const jobs = {
    "indexing": {
      "dryRun": false,
      "payload": {
        "base": null,                   // config[arg1].base
        "strategy": null,               // arg1
        "command": null,                // config[arg1].command
        "context": {
          "entry": null,                // config[arg1].entry
          "brand": null,                // config[arg1].brand
          "brandID": null,              // config[arg1].brandID
          "lang": "en"                  // optional argument4 || config[arg1].lang
        }
      }
    },
    "extraction": {
      "dryRun": false,
      "payload": {
        "brandID": null,            // config[arg1].brandID
        "brand": null,              // config[arg1].brand
        "interval": null,           // optional argument3 || config[arg1].interval
        "lang": null,               // optional argument4 || config[arg1].lang
        "source": null              // config[arg1].source
      }
    },
  };

  const messaging = {
    "indexing": {
      "exchange": "scraper",
      "route": "crawler",
      "replyTo": "collector",
    },
    "extraction": {
      "exchange": "scraper",
      "route": "origin",
      "replyTo": "scrape.data.raw",
    },
  };


  for (const job of jobs) {
    logger.debug('Start Jobs');
    // indexing 
    await channel.publish(
      'scraper',
      'crawler',
      Buffer.from(JSON.stringify(job)),
      { replyTo: 'collector', correlationId: shortid.generate() });

    // originator -> extraction
    // await channel.publish(
    //   'scraper',
    //   'origin',
    //   Buffer.from(JSON.stringify(job)),
    //   { replyTo: 'scrape.data.raw', correlationId: shortid.generate() });

    console.log('submitted >', job)

  }

  process.exit(0)

})();