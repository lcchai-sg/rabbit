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

  const b = {
    "tutima": {
      "source": "official",
      "brand": "Tutima",
      "brandID": 254,
      "strategy": "tutima",
      "interval": 3000,
      "entry": "https://tutima.com/sitemaps.xml",
      "base": "https://tutima.com",
    },
    "tutima": {
      "source": "official",
      "brand": "Baume et Mercier",
      "brandID": 178,
      "strategy": "baumemercier",
      "interval": 3000,
      "entry": "https://www.baume-et-mercier.com/us/en/sitemap.xml",
      "base": "https://www.baume-et-mercier.com/us/en",
    },
    "marcjacobs": {
      "base": "https://www.marcjacobs.com",
      "strategy": "marcjacobs",
      "source": "official",
      "entry": "", //"https://www.marcjacobs.com/sitemap_0.xml",
      "brand": "Marc Jacobs",
      "brandID": 214,
    },
    "piaget": {
      "base": "https://www.piaget.com",
      "strategy": "piaget",
      "source": "official",
      "entry": "https://www.piaget.com/sitemap.xml",
      "brand": "Piaget",
      "brandID": 56,
    },
    "ball": {
      "base": "https://shop.ballwatch.ch",
      "strategy": "ball",
      "source": "official",
      "entry": "https://shop.ballwatch.ch/en/watchfinder",
      "brand": "Ball",
      "brandID": 188,
    },
    "LV": {
      "base": "https://us.louisvuitton.com",
      "strategy": "lv",
      "source": "official",
      "entry": "",
      "brand": "Louis Vuitton",
      "brandID": 130,
    },
    "hugoboss": {
      "base": "https://www.hugoboss.com",
      "strategy": "hugoboss",
      "source": "official",
      "entry": "",
      "brand": "Hugo Boss",
      "brandID": 192,
    },
    "armani": {
      "base": "",
      "strategy": "armani",
      "source": "official",
      "entry": "",
      "brand": "Emporio Armani",
      "brandID": 218,
    },
    "meistersinger": {
      "base": "",
      "strategy": "meistersinger",
      "source": "official",
      "entry": "https://meistersinger.us/shop-tagged/single-hand-watch/",
      "brand": "MeisterSinger",
      "brandID": 280,
    },
    "longines": {
      "base": "",
      "strategy": "longines",
      "source": "official",
      "entry": "https://www.longines.com/en-us/watches",
      "brand": "Longines",
      "brandID": 120,
    },
    "ulysse": {
      "base": "https://www.ulysse-nardin.com/row_en",
      "strategy": "ulysse",
      "source": "official",
      "entry": "https://www.ulysse-nardin.com/row_en/",
      "brand": "Ulysse Nardin",
      "brandID": 162,
    },
    "maurice": {
      "base": "https://www.mauricelacroix.com",
      "strategy": "mauricelacroix",
      "source": "official",
      "entry": "https://www.mauricelacroix.com/media/sitemap_us_en.xml",
      "brand": "Maurice Lacroix",
      "brandID": 26,
    },
    "breitling": {
      "base": "https://www.breitling.com",
      "strategy": "breitling",
      "source": "official",
      "entry": "https://www.breitling.com/us-en/sitemap/collections.xml",
      "brand": "Breitling",
      "brandID": 118,
    },
    "parmigiani": {
      "base": "https://www.parmigiani.com",
      "strategy": "parmigiani",
      "source": "official",
      "entry": "https://www.parmigiani.com/en/",
      "brand": "Parmigiani Fleurier",
      "brandID": 158,
    },
    "bulova": {
      "base": "https://intl.bulova.com",
      "strategy": "bulova",
      "source": "official",
      "entry": "https://intl.bulova.com/sitemap_products_1.xml?from=4298068545&to=4254557372463",
      "brand": "Bulova",
      "brandID": 268,
    },
    "hublot": {
      "base": "https://www.hublot.com",
      "strategy": "hublot",
      "source": "official",
      "entry": "https://www.hublot.com/en-us/watches",
      "brand": "Hublot",
      "brandID": 46,
    },
    "skagen": {
      "base": "https://www.skagen.com/en-us",
      "strategy": "skagen",
      "source": "official",
      "entry": "https://www.skagen.com/en-us/sitemap/",
      "brand": "Skagen",
      "brandID": 240,
    },
    "tudor": {
      "base": "https://www.tudorwatch.com",
      "strategy": "tudor",
      "source": "official",
      "entry": "https://www.tudorwatch.com/sitemap-en.xml",
      "brand": "Tudor",
      "brandID": 2,
    },
    "rolex": {
      "base": "https://www.rolex.com",
      "strategy": "rolex",
      "source": "official",
      "entry": "https://www.rolex.com/en/sitemap.xml",
      "brand": "Rolex",
      "brandID": 1,
    },
    "tissot": {
      "base": "https://www.tissotwatches.com",
      "strategy": "tissot",
      "source": "official",
      "entry": "https://www.tissotwatches.com/media/sitemap/sitemap_en_en.xml",
      "brand": "Tissot",
      "brandID": 82,
    },
    "tagheuer": {
      "base": "https://www.tagheuer.com/us/en",
      "strategy": "tagheuer",
      "source": "official",
      "entry": "https://www.tagheuer.com/us/en/sitemap_1-image.xml",
      "brand": "Tag Heuer",
      "brandID": 54,
    },
    "iwc": {
      "base": "https://www.iwc.com",
      "strategy": "iwc",
      "source": "official",
      "entry": "https://www.iwc.com/en.sitemap.xml",
      "brand": "IWC",
      "brandID": 4,
    },
    "hilfiger": {
      "base": "https://usa.tommy.com",
      "strategy": "tommyhilfiger",
      "source": "official",
      "entry": "https://usa.tommy.com/static/sitemap.xml",
      "brand": "Tommy Hilfiger",
      "brandID": 252,
    },
    "grand-seiko": {
      "base": "https://www.grand-seiko.com/us-en/collections/",
      "strategy": "grand-seiko",
      "source": "official",
      "entry": "https://www.grand-seiko.com/__api/posts/list",
      "brand": "Grand Seiko",
      "brandID": 84,
    },
    "guess": {
      "base": "https://www.guess.com/us/en",
      "strategy": "guess",
      "source": "official",
      "entry": "https://www.guess.com/us/en",
      "brand": "Guess",
      "brandID": 250,
    },
    "diesel": {
      "base": "https://shop.diesel.com",
      "strategy": "diesel",
      "source": "official",
      "entry": "https://shop.diesel.com/en/home",
      "brand": "Diesel",
      "brandID": 244,
    },
    "hamilton": {
      "base": "https://www.hamiltonwatch.com/en-us",
      "strategy": "hamilton",
      "source": "official",
      "entry": "https://www.hamiltonwatch.com/pub/mediam2/sitemap/sitemap_en_us.xml",
      "brand": "Hamilton",
      "brandID": 62,
    },
    "mido": {
      "base": "https://www.midowatches.com/us/",
      "strategy": "mido",
      "source": "official",
      "entry": "https://www.midowatches.com/us/sitemap.xml",
      "brand": "mido",
      "brandID": 172,
    },
    "sinn": {
      "base": "https://www.sinn.de",
      "strategy": "sinn",
      "source": "official",
      "entry": "https://www.sinn.de/en/",
      "brand": "sinn",
      "brandID": 180,
    },
    "prestigetime": {
      "base": "https://www.prestigetime.com",
      "strategy": "prestigetime",
      "source": "prestigetime",
      "entry": 'https://www.prestigetime.com/sitemap.xml',
    },
    "watchmaxx": {
      "base": "https://www.watchmaxx.com",
      "strategy": "watchmaxx",
      "source": "watchmaxx",
      "entry": "https://www.watchmaxx.com/sitemap.xml",
    },
    "mayfair": {
      "base": "https://www.watchesofmayfair.com",
      "strategy": "watchesofmayfair",
      "source": "watchesofmayfair",
      "entry": "https://www.watchesofmayfair.com/sitemap.xml",
    },
    "jomashop": {
      "base": "https://www.jomashop.com",
      "strategy": "jomashop",
      "source": "jomashop",
      "entry": "https://www.jomashop.com/sitemap.xml",
    },
    // "watchbase": {
    //   "base": "https://www.watchbase.com",
    //   "strategy": "watchbase",
    //   "source": "watchbase",
    //   "entry": "http://api.watchbase.com/v1/brands?format=json&key=${apiKey}",
    // },
    "kechiq": {
      "base": "https://www.kechiq.com",
      "strategy": "kechiq",
      "entry": "http://www.kechiq.com/sitemapUS.xml",
      "source": "kechiq",
    },

  }

  const job = {
    "indexing":
    {
      //   "dryRun": false,
      //   "payload": {
      //     "base": "https://www.baume-et-mercier.com/us/en",
      //     "strategy": "baumemercier",
      //     "command": "indexing",
      //     "context": {
      //       "source": "official",
      //       "entry": "https://www.baume-et-mercier.com/us/en/sitemap.xml",
      //       "brand": "Baume et Mercier",
      //       "brandID": 178,
      //       "lang": "en",
      //     }
      //   }
    },
    "extract":
    {
      //   "dryRun": false,
      //   "payload": {
      //     "brandID": 62,
      //     "brand": "hamilton",
      //     "interval": 3000,
      //     "lang": "en",
      //     "source": "official"
      //   }
    },
    "extractProd":
    {
      //   dryRun: false,
      //   payload: {
      //     strategy: "tutima",
      //     command: "extraction",
      //     context: {
      //       entry: "https://tutima.com/watch/automatic-maroon-brown-6121-01/",
      //       lang: "en",
      //       brand: "Tutima",
      //       brandID: 254,
      //       reference: "6121-01",
      //       name: "automatic maroon brown",
      //     }
      //   }
    }
  };

  const jobs = [
    // originator -> extraction
    // {
    //   "dryRun": false,
    //   "payload": {
    //     "strategy": "parmigiani",
    //     "brandID": 158,
    //     "brand": "Parmigiani Fleurier",
    //     "interval": 3000,
    //     "lang": "en",
    //     "source": "official"
    //   }
    // },
    // {
    //   "dryRun": false,
    //   "payload": {
    //     "strategy": "bulova",
    //     "brandID": 268,
    //     "brand": "Bulova",
    //     "interval": 3000,
    //     "lang": "en",
    //     "source": "official"
    //   }
    // },
    // {
    //   "dryRun": false,
    //   "payload": {
    //     "strategy": "hublot",
    //     "brandID": 46,
    //     "brand": "Hublot",
    //     "interval": 3000,
    //     "lang": "en",
    //     "source": "official"
    //   }
    // },
    // {
    //   "dryRun": false,
    //   "payload": {
    //     "strategy": "tommyhilfiger",
    //     "brandID": 252,
    //     "brand": "Tommy Hilfiger",
    //     "interval": 5000,
    //     "lang": "en",
    //     "source": "official"
    //   }
    // },
    // {
    //   "dryRun": false,
    //   "payload": {
    //     "strategy": "tagheuer",
    //     "brandID": 54,
    //     "brand": "Tag Heuer",
    //     "interval": 3000,
    //     "lang": "en",
    //     "source": "official"
    //   }
    // },
    // {
    //   "dryRun": false,
    //   "payload": {
    //     "strategy": "iwc",
    //     "brandID": 4,
    //     "brand": "IWC",
    //     "interval": 3000,
    //     "lang": "en",
    //     "source": "official"
    //   }
    // },
    // {
    //   "dryRun": false,
    //   "payload": {
    //     "strategy": "guess",
    //     "brandID": 250,
    //     "brand": "Guess",
    //     "interval": 3000,
    //     "lang": "en",
    //     "source": "official"
    //   }
    // },
    // {
    //   "dryRun": false,
    //   "payload": {
    //     "strategy": "hamilton",
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
    //     "strategy": "rolex",
    //     "brandID": 1,
    //     "brand": "Rolex",
    //     "interval": 1000,
    //     "lang": "en",
    //     "source": "official"
    //   }
    // },
    // {
    //   "dryRun": false,
    //   "payload": {
    //     "strategy": "tissot",
    //     "brandID": 82,
    //     "brand": "Tissot",
    //     "interval": 3000,
    //     "lang": "en",
    //     "source": "official"
    //   }
    // },
    // {
    //   "dryRun": false,
    //   "payload": {
    //     "strategy": "grand-seiko",
    //     "brandID": 84,
    //     "brand": "Grand Seiko",
    //     "interval": 3000,
    //     "lang": "en",
    //     "source": "official"
    //   }
    // },
    // originator -> extraction
    // {
    //   "dryRun": false,
    //   "payload": {
    //     "strategy": "mido",
    //     "brandID": 172,
    //     "brand": "mido",
    //     "interval": 3000,
    //     "lang": "en",
    //     "source": "official"
    //   }
    // },
    // {
    //   "dryRun": false,
    //   "payload": {
    //     "strategy": "ball",
    //     "brandID": 188,
    //     "brand": "Ball",
    //     "interval": 3000,
    //     "lang": "en",
    //     "source": "official"
    //   }
    // },
    // {
    //   "dryRun": false,
    //   "payload": {
    //     "strategy": "lv",
    //     "brandID": 130,
    //     "brand": "Louis Vuitton",
    //     "interval": 3000,
    //     "lang": "en",
    //     "source": "official"
    //   }
    // },
    {
      "dryRun": false,
      "payload": {
        "strategy": "tudor",
        "brandID": 2,
        "brand": "Tudor",
        "interval": 3000,
        "lang": "en",
        "source": "official"
      }
    },
    // {
    //   "dryRun": false,
    //   "payload": {
    //     "strategy": "meistersinger",
    //     "brandID": 280,
    //     "brand": "MeisterSinger",
    //     "interval": 3000,
    //     "lang": "en",
    //     "source": "official"
    //   }
    // },
    // {
    //   "dryRun": false,
    //   "payload": {
    //     "strategy": "longines",
    //     "brandID": 120,
    //     "brand": "Longines",
    //     "interval": 3000,
    //     "lang": "en",
    //     "source": "official"
    //   }
    // },
    // {
    //   "dryRun": false,
    //   "payload": {
    //     "strategy": "armani",
    //     "brandID": 218,
    //     "brand": "Emporio Armani",
    //     "interval": 3000,
    //     "lang": "en",
    //     "source": "official"
    //   }
    // },
    // {
    //   "dryRun": false,
    //   "payload": {
    //     "strategy": "hugoboss",
    //     "brandID": 192,
    //     "brand": "Hugo Boss",
    //     "interval": 3000,
    //     "lang": "en",
    //     "source": "official"
    //   }
    // },
    // originator -> extraction
    // {
    //   "dryRun": false,
    //   "payload": {
    //     "strategy": "diesel",
    //     "brandID": 244,
    //     "brand": "Diesel",
    //     "interval": 3000,
    //     "lang": "en",
    //     "source": "official"
    //   }
    // },
    // {
    //   "dryRun": false,
    //   "payload": {
    //     "strategy": "tutima",
    //     "brandID": 254,
    //     "brand": "Tutima",
    //     "interval": 3000,
    //     "lang": "en",
    //     "source": "official"
    //   }
    // },
    // {
    //   "dryRun": false,
    //   "payload": {
    //     "strategy": "sinn",
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
    //     "strategy": "baumemercier",
    //     "brandID": 178,
    //     "brand": "Baume et Mercier",
    //     "interval": 3000,
    //     "lang": "en",
    //     "source": "official"
    //   }
    // },
    // {
    //   "dryRun": false,
    //   "payload": {
    //     "strategy": "marcjacobs",
    //     "brandID": 214,
    //     "brand": "Marc Jacobs",
    //     "interval": 3000,
    //     "lang": "en",
    //     "source": "official"
    //   }
    // },
    // {
    //   "dryRun": false,
    //   "payload": {
    //     "strategy": "Skagen",
    //     "brandID": 240,
    //     "brand": "Skagen",
    //     "interval": 3000,
    //     "lang": "en",
    //     "source": "official"
    //   }
    // },
    // {
    //   "dryRun": false,
    //   "payload": {
    //     "strategy": "piaget",
    //     "brandID": 56,
    //     "brand": "Piaget",
    //     "interval": 3000,
    //     "lang": "en",
    //     "source": "official"
    //   }
    // },
    // {
    //   "dryRun": false,
    //   "payload": {
    //     "strategy": "ulysse",
    //     "brandID": 162,
    //     "brand": "Ulysse Nardin",
    //     "interval": 3000,
    //     "lang": "en",
    //     "source": "official"
    //   }
    // },
    // {
    //   "dryRun": false,
    //   "payload": {
    //     "strategy": "mauricelacroix",
    //     "brandID": 26,
    //     "brand": "Maurice Lacroix",
    //     "interval": 3000,
    //     "lang": "en",
    //     "source": "official"
    //   }
    // },
    // {
    //   "dryRun": false,
    //   "payload": {
    //     "strategy": "prestigetime",
    //     "interval": 5000,
    //     "lang": "en",
    //     "source": "prestigetime",
    //   },
    // },
    // {
    //   "dryRun": false,
    //   "payload": {
    //     "strategy": "kechiq",
    //     "interval": 3000,
    //     "lang": "en",
    //     "source": "kechiq",
    //   },
    // },
    // {
    //   "dryRun": false,
    //   "payload": {
    //     "strategy": "jomashop",
    //     "interval": 5000,
    //     "lang": "en",
    //     "source": "jomashop",
    //   },
    // },
    // {
    //   "dryRun": false,
    //   "payload": {
    //     "strategy": "watchmaxx",
    //     "interval": 5000,
    //     "lang": "en",
    //     "source": "watchmaxx",
    //   },
    // },
    // {
    //   "dryRun": false,
    //   "payload": {
    //     "strategy": "watchesofmayfair",
    //     "interval": 5000,
    //     "lang": "en",
    //     "source": "watchesofmayfair",
    //   },
    // },
    // {
    //   "dryRun": false,
    //   "payload": {
    //     "interval": 5000,
    //     "lang": "en",
    //     "source": "kechiq"
    //   },
    // },
    // extract 1 watch id from watchbase
    // {
    //   "dryRun": false,
    //   "payload": {
    //     "base": "https://www.watchbase.com",
    //     "strategy": "watchbase",
    //     "command": "extraction",
    //     "context": {
    //       "entry": "http://api.watchbase.com/v1/watch?id=${watchID}&key=${apiKey}&format=json",
    //       "lang": "en",
    //       "id": 10358,
    //     }
    //   }
    // },

    // extraction by product url
    // {
    //   dryRun: false,
    //   payload: {
    //     strategy: "tutima",
    //     command: "extraction",
    //     context: {
    //       entry: "https://tutima.com/watch/tempostopp-6650-01/",
    //       brand: "Tutima",
    //       lang: "en",
    //       source: "official",
    //     }
    //   }
    // }
    // baume et mercier
    // {
    //   dryRun: true,
    //   payload: {
    //     strategy: "baumemercier",
    //     command: "extraction",
    //     context: {
    //       entry: "https://www.baume-et-mercier.com/us/en/collections/clifton-club-men/bmm0a10369---10369.html",
    //       brand: "Baume et Mercier",
    //       brandID: 178,
    //       lang: "en",
    //       source: "official",
    //     }
    //   }
    // }
    // {
    //   dryRun: false,
    //   payload: {
    //     strategy: "prestigetime",
    //     command: "extraction",
    //     context: {
    //       entry: "https://www.prestigetime.com/item/Omega/Constellation-95/1167.70.html",
    //       lang: "en",
    //       source: "prestigetime",
    //     }
    //   }
    // }

  ];

  for (const job of jobs) {
    logger.debug('Start Jobs');
    // indexing 
    // await channel.publish(
    //   'scraper',
    //   'crawler',
    //   Buffer.from(JSON.stringify(job)),
    //   { replyTo: 'collector', correlationId: shortid.generate() });

    // extract by product url
    // await channel.publish(
    //   'scraper',
    //   'crawler',
    //   Buffer.from(JSON.stringify(job)),
    //   { replyTo: 'scrape.data.raw', correlationId: shortid.generate() });

    // originator -> extraction
    await channel.publish(
      'scraper',
      'origin',
      Buffer.from(JSON.stringify(job)),
      { replyTo: 'scrape.data.raw', correlationId: shortid.generate() });

    console.log('submitted >', job)

  }

  process.exit(0)

})();