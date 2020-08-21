const { MessageStation } = require("@cosmos/utils");
const shortid = require('shortid');

(async function () {
  console.debug('Scraper');
  // amqp://kswsdxln:ZsZJndMGqhVPo-hxbJ-Tg9Y-Mn18TGCP@vulture.rmq.cloudamqp.com/kswsdxln
  const mqHost = process.env.MESSAGE_HOST || 'vulture.rmq.cloudamqp.com';
  const mqUser = process.env.MESSAGE_USER || 'kswsdxln';
  const mqPass = process.env.MESSAGE_PASS || 'ZsZJndMGqhVPo-hxbJ-Tg9Y-Mn18TGCP';
  const mqVhost = process.env.MESSAGE_VHOST || 'kswsdxln';
  const station = await MessageStation
    .connect({
      host: mqHost,
      user: mqUser,
      pass: mqPass,
      vhost: mqVhost
    });

  const channel = await station.createChannel();

  const jobs = [
    // indexing
    {
      "dryRun": false,
      "payload": {
        "base": "https://www.hamiltonwatch.com/en-us",
        "strategy": "hamilton",
        "command": "newIndexing",
        "context": {
          "entry": "https://www.hamiltonwatch.com/pub/mediam2/sitemap/sitemap_en_us.xml",
          "brand": "hamilton",
          "brandID": 62,
          "lang": "en"
        }
      }
    },

    // mido sitemap indexing
    // {
    //   "dryRun": false,
    //   "payload": {
    //     "base": "https://www.midowatches.com/us/",
    //     "strategy": "mido",
    //     "command": "newIndexing",
    //     "context": {
    //       "entry": "https://www.midowatches.com/us/sitemap.xml",
    //       "brand": "mido",
    //       "brandID": 172,
    //       "lang": "en"
    //     }
    //   }
    // },

    // mido website indexing
    // {
    //   "dryRun": false,
    //   "payload": {
    //     "base": "https://www.midowatches.com",
    //     "strategy": "mido",
    //     "command": "indexing",
    //     "context": {
    //       "entry": "https://www.midowatches.com/us/swiss-watches-collections",
    //       "brand": "mido",
    //       "brandID": 172,
    //       "lang": "en"
    //     }
    //   }
    // },
    // SINN
    // {
    //   "dryRun": false,
    //   "payload": {
    //     "base": "https://www.sinn.de",
    //     "strategy": "sinn",
    //     "command": "indexing",
    //     "context": {
    //       "entry": "https://www.sinn.de/en/",
    //       "brand": "sinn",
    //       "brandID": 180,
    //       "lang": "en"
    //     }
    //   }
    // },
    // prestigetime
    // {
    //   "dryRun": false,
    //   "payload": {
    //     "base": "https://www.prestigetime.com",
    //     "strategy": "prestigetime",
    //     "command": "indexing",
    //     "context": {
    //       "entry": 'https://www.prestigetime.com/sitemap.xml',
    //       "lang": "en"
    //     }
    //   }
    // },
    // watchmaxx
    // {
    //   "dryRun": false,
    //   "payload": {
    //     "base": "https://www.watchmaxx.com",
    //     "strategy": "watchmaxx",
    //     "command": "indexing",
    //     "context": {
    //       "entry": "https://www.watchmaxx.com/sitemap.xml",
    //       "lang": "en"
    //     }
    //   }
    // },
    // watchesofmayfair
    // {
    //   "dryRun": false,
    //   "payload": {
    //     "base": "https://www.watchesofmayfair.com",
    //     "strategy": "watchesofmayfair",
    //     "command": "indexing",
    //     "context": {
    //       "entry": "https://www.watchesofmayfair.com/sitemap.xml",
    //       "lang": "en"
    //     }
    //   }
    // },
    // jomashop
    // {
    //   "dryRun": false,
    //   "payload": {
    //     "base": "https://www.jomashop.com",
    //     "strategy": "jomashop",
    //     "command": "indexing",
    //     "context": {
    //       "entry": "https://www.jomashop.com/sitemap.xml",
    //       "lang": "en"
    //     }
    //   }
    // },
    // watchbase
    // {
    //   "dryRun": false,
    //   "payload": {
    //     "base": "https://www.watchbase.com",
    //     "strategy": "watchbase",
    //     "command": "indexing",
    //     "context": {
    //       "entry": "http://api.watchbase.com/v1/brands?format=json&key=${apiKey}",
    //       "lang": "en"
    //     }
    //   }
    // },

    // originator -> extraction
    // {
    //   "dryRun": false,
    //   "payload": {
    //     "brandID": 62,
    //     "brand": "hamilton",
    //     "interval": 3000,
    //     "lang": "en",
    //     "source": "official"
    //   }
    // },
    // originator -> extraction
    // {
    //   "dryRun": false,
    //   "payload": {
    //     "brandID": 172,
    //     "brand": "mido",
    //     "interval": 3000,
    //     "lang": "en",
    //     "source": "official"
    //   }
    // },
    // originator -> extraction
    // {
    //   "dryRun": false,
    //   "payload": {
    //     "brandID": 180,
    //     "brand": "sinn",
    //     "interval": 3000,
    //     "lang": "en",
    //     "source": "official"
    //   }
    // },
    // {
    //   "dryRun": false,
    //   "payload": {
    //     "interval": 5000,
    //     "lang": "en",
    //     "source": "prestigetime"
    //   },
    // },
    // {
    //   "dryRun": false,
    //   "payload": {
    //     "interval": 5000,
    //     "lang": "en",
    //     "source": "watchmaxx"
    //   },
    // },
    // {
    //   "dryRun": false,
    //   "payload": {
    //     "interval": 5000,
    //     "lang": "en",
    //     "source": "watchesofmayfair"
    //   },
    // },
    // {
    //   "dryRun": false,
    //   "payload": {
    //     "base": "https://www.watchbase.com",
    //     "strategy": "watchbase",
    //     "command": "extraction",
    //     "context": {
    //       "entry": "http://api.watchbase.com/v1/watch?id=${watchID}&key=${apiKey}&format=json",
    //       "lang": "en",
    //       "id": "10358",
    //     }
    //   }
    // },
  ];

  for (const job of jobs) {
    console.debug('Start Jobs');
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