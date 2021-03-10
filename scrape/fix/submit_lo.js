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
    // originator -> extraction
    // {
    //   "dryRun": false,
    //   "payload": {
    //     "strategy": "festina",
    //     "base": "https://festina.com",
    //     "brandID": 364,
    //     "brand": "Festina",
    //     "interval": 3000,
    //     "lang": "en",
    //     "source": "official"
    //   }
    // },
    // {
    //   "dryRun": false,
    //   "payload": {
    //     "strategy": "bremont",
    //     "base": "https://www.bremont.com",
    //     "brandID": 342,
    //     "brand": "Bremont",
    //     "interval": 3000,
    //     "lang": "en",
    //     "source": "official"
    //   }
    // },
    // {
    //   "dryRun": false,
    //   "payload": {
    //     "strategy": "hyt",
    //     "base": "https://www.hytwatches.com",
    //     "brandID": 310,
    //     "brand": "HYT",
    //     "interval": 3000,
    //     "lang": "en",
    //     "source": "official"
    //   }
    // },
    // {
    //   "dryRun": false,
    //   "payload": {
    //     "strategy": "seiko",
    //     "base": "https://www.seikowatches.com",
    //     "brandID": 72,
    //     "brand": "Seiko",
    //     "interval": 3000,
    //     "lang": "en",
    //     "source": "official"
    //   }
    // },
    // {
    //   "dryRun": false,
    //   "payload": {
    //     "strategy": "alange",
    //     "base": "https://www.alange-soehne.com/en",
    //     "brandID": 293,
    //     "brand": "A. Lange & Söhne",
    //     "interval": 3000,
    //     "lang": "en",
    //     "source": "official"
    //   }
    // },
    // {
    //   "dryRun": false,
    //   "payload": {
    //     "strategy": "citizen",
    //     "base": "https://www.citizenwatch.com",
    //     "brandID": 86,
    //     "brand": "Citizen",
    //     "interval": 3000,
    //     "lang": "en",
    //     "source": "official"
    //   }
    // },
    // {
    //   "dryRun": false,
    //   "payload": {
    //     "strategy": "aboutvintage",
    //     "base": "https://aboutvintage.com",
    //     "brandID": 152,
    //     "brand": "About Vintage",
    //     "interval": 3000,
    //     "lang": "en",
    //     "source": "official"
    //   }
    // },
    // {
    //   "dryRun": false,
    //   "payload": {
    //     "strategy": "cvstos",
    //     "base": "https://www.cvstos.com/",
    //     "brandID": 186,
    //     "brand": "Cvstos",
    //     "interval": 3000,
    //     "lang": "en",
    //     "source": "official"
    //   }
    // },
    // {
    //   "dryRun": false,
    //   "payload": {
    //     "strategy": "michaelkors",
    //     "base": "https://www.michaelkors.global/",
    //     "brandID": 190,
    //     "brand": "Michael Kors",
    //     "interval": 3000,
    //     "lang": "en",
    //     "source": "official"
    //   }
    // },
    // {
    //   "dryRun": false,
    //   "payload": {
    //     "strategy": "memorigin",
    //     "base": "https://www.memorigin.com/mem_1dot1/",
    //     "brandID": 256,
    //     "brand": "Memorigin",
    //     "interval": 3000,
    //     "lang": "en",
    //     "source": "official"
    //   }
    // },
    // {
    //   "dryRun": false,
    //   "payload": {
    //     "strategy": "muehle",
    //     "base": "https://www.muehle-glashuette.de/",
    //     "brandID": 292,
    //     "brand": "Muehle Glasshuette",
    //     "interval": 3000,
    //     "lang": "en",
    //     "source": "official"
    //   }
    // },
    // {
    //   "dryRun": false,
    //   "payload": {
    //     "strategy": "audemarspiguet",
    //     "base": 'https://www.audemarspiguet.com',
    //     "brandID": 18,
    //     "brand": "Audemars Piguet",
    //     "interval": 3000,
    //     "lang": "en",
    //     "source": "official"
    //   }
    // },
    // {
    //   "dryRun": false,
    //   "payload": {
    //     "strategy": "vacheronconstantin",
    //     "base": "https://www.vacheron-constantin.com",
    //     "brandID": 3,
    //     "brand": "Vacheron Constantin",
    //     "interval": 3000,
    //     "lang": "en",
    //     "source": "official"
    //   }
    // },
    // {
    //   "dryRun": false,
    //   "payload": {
    //     "strategy": "montblanc",
    //     "brandID": 5,
    //     "brand": "Montblnc",
    //     "interval": 3000,
    //     "lang": "en",
    //     "source": "official"
    //   }
    // },
    // {
    //   "dryRun": false,
    //   "payload": {
    //     "strategy": "girardperregaux",
    //     "brandID": 98,
    //     "brand": "Girard Perregaux",
    //     "interval": 3000,
    //     "lang": "en",
    //     "source": "official"
    //   }
    // },
    // {
    //   "dryRun": false,
    //   "payload": {
    //     "strategy": "panerai",
    //     "brandID": 58,
    //     "brand": "Panerai",
    //     "interval": 3000,
    //     "lang": "en",
    //     "source": "official"
    //   }
    // },
    // {
    //   "dryRun": false,
    //   "payload": {
    //     "strategy": "frederiqueconstant",
    //     "brandID": 154,
    //     "brand": "Frederique Constant",
    //     "interval": 3000,
    //     "lang": "en",
    //     "source": "official"
    //   }
    // },
    // {
    //   "dryRun": false,
    //   "payload": {
    //     "strategy": "zenith",
    //     "brandID": 80,
    //     "brand": "Zenith",
    //     "interval": 3000,
    //     "lang": "en",
    //     "source": "official"
    //   }
    // },
    // {
    //   "dryRun": false,
    //   "payload": {
    //     "strategy": "cartier",
    //     "brandID": 28,
    //     "brand": "Cartier",
    //     "interval": 3000,
    //     "lang": "en",
    //     "source": "official"
    //   }
    // },
    // {
    //   "dryRun": false,
    //   "payload": {
    //     "strategy": "sevenfriday",
    //     "brandID": 142,
    //     "brand": "Sevenfriday",
    //     "interval": 3000,
    //     "lang": "en",
    //     "source": "official"
    //   }
    // },
    // {
    //   "dryRun": false,
    //   "payload": {
    //     "strategy": "patek",
    //     "brandID": 22,
    //     "brand": "Patek Philippe",
    //     "interval": 3000,
    //     "lang": "en",
    //     "source": "official"
    //   }
    // },
    // {
    //   "dryRun": false,
    //   "payload": {
    //     "strategy": "gagamilano",
    //     "brandID": 96,
    //     "brand": "Gaga Milano",
    //     "interval": 3000,
    //     "lang": "en",
    //     "source": "official"
    //   }
    // },
    // {
    //   "dryRun": false,
    //   "payload": {
    //     "strategy": "gucci",
    //     "brandID": 156,
    //     "brand": "Gucci",
    //     "interval": 3000,
    //     "lang": "en",
    //     "source": "official"
    //   }
    // },
    // {
    //   "dryRun": false,
    //   "payload": {
    //     "strategy": "jaquetdroz",
    //     "brandID": 174,
    //     "brand": "Jaquet Droz",
    //     "interval": 3000,
    //     "lang": "en",
    //     "source": "official"
    //   }
    // },
    // {
    //   "dryRun": false,
    //   "payload": {
    //     "strategy": "orient",
    //     "brandID": 100,
    //     "brand": "Orient",
    //     "interval": 3000,
    //     "lang": "en",
    //     "source": "official"
    //   }
    // },
    // {
    //   "dryRun": false,
    //   "payload": {
    //     "strategy": "oris",
    //     "brandID": 164,
    //     "brand": "Oris",
    //     "interval": 3000,
    //     "lang": "en",
    //     "source": "official"
    //   }
    // },
    // {
    //   "dryRun": false,
    //   "payload": {
    //     "strategy": "nomosglashuette",
    //     "brandID": 134,
    //     "brand": "Nomos Glashuette",
    //     "interval": 3000,
    //     "lang": "en",
    //     "source": "official"
    //   }
    // },
    // {
    //   "dryRun": false,
    //   "payload": {
    //     "strategy": "jaegerlecoultre",
    //     "brandID": 16,
    //     "brand": "Jaeger Le Coultre",
    //     "interval": 3000,
    //     "lang": "en",
    //     "source": "official"
    //   }
    // },
    // {
    //   "dryRun": false,
    //   "payload": {
    //     "strategy": "omega",
    //     "brandID": 20,
    //     "brand": "Omega",
    //     "interval": 3000,
    //     "lang": "en",
    //     "source": "official"
    //   }
    // },
    // {
    //   "dryRun": false,
    //   "payload": {
    //     "strategy": "rado",
    //     "brandID": 160,
    //     "brand": "Rado",
    //     "interval": 3000,
    //     "lang": "en",
    //     "source": "official"
    //   }
    // },
    // {
    //   "dryRun": false,
    //   "payload": {
    //     "strategy": "glashuette",
    //     "brandID": 168,
    //     "brand": "Glashuette Original",
    //     "interval": 3000,
    //     "lang": "en",
    //     "source": "official"
    //   }
    // },
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
    //     "strategy": "bellross",
    //     "brandID": 112,
    //     "brand": "Bell & Ross",
    //     "interval": 5000,
    //     "lang": "en",
    //     "source": "official"
    //   }
    // },
    // {
    //   "dryRun": false,
    //   "payload": {
    //     "strategy": "breitling",
    //     "brandID": 118,
    //     "brand": "Breitling",
    //     "interval": 5000,
    //     "lang": "en",
    //     "source": "official"
    //   }
    // },
    // {
    //   "dryRun": false,
    //   "payload": {
    //     "strategy": "blancpain",
    //     "brandID": 52,
    //     "brand": "Blancpain",
    //     "interval": 5000,
    //     "lang": "en",
    //     "source": "official"
    //   }
    // },
    // {
    //   "dryRun": false,
    //   "payload": {
    //     "strategy": "breguet",
    //     "brandID": 132,
    //     "brand": "Breguet",
    //     "interval": 5000,
    //     "lang": "en",
    //     "source": "official"
    //   }
    // },
    // {
    //   "dryRun": false,
    //   "payload": {
    //     "strategy": "casio",
    //     "brandID": 76,
    //     "brand": "Casio",
    //     "interval": 5000,
    //     "lang": "en",
    //     "source": "official"
    //   }
    // },
    // {
    //   "dryRun": false,
    //   "payload": {
    //     "strategy": "bulgari",
    //     "brandID": 32,
    //     "brand": "Bvlgari",
    //     "interval": 5000,
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
    //     "strategy": "briston",
    //     "brandID": 282,
    //     "brand": "Briston",
    //     "interval": 3000,
    //     "lang": "en",
    //     "source": "official"
    //   }
    // },
    // {
    //   "dryRun": false,
    //   "payload": {
    //     "strategy": "alpina",
    //     "brandID": 288,
    //     "brand": "Alpina",
    //     "interval": 3000,
    //     "lang": "en",
    //     "source": "official"
    //   }
    // },
    // {
    //   "dryRun": false,
    //   "payload": {
    //     "strategy": "chopard",
    //     "brandID": 44,
    //     "brand": "Chopard",
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
    //     "brand": "Hamilton",
    //     "interval": 3000,
    //     "lang": "en",
    //     "source": "official"
    //   }
    // },
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
    //     "strategy": "chanel",
    //     "brandID": 70,
    //     "brand": "Chanel",
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
    // {
    //   "dryRun": false,
    //   "payload": {
    //     "strategy": "tudor",
    //     "brandID": 2,
    //     "brand": "Tudor",
    //     "interval": 3000,
    //     "lang": "en",
    //     "source": "official"
    //   }
    // },
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
    {
      "dryRun": false,
      "payload": {
        "strategy": "jomashop",
        "interval": 5000,
        "lang": "en",
        "source": "jomashop",
      },
    },
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
    //     "strategy": "kechiq",
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
    // },
    // {
    //   dryRun: false,
    //   payload: {
    //     strategy: "prestigetime",
    //     command: "extraction",
    //     context: {
    //       entry: "https://www.prestigetime.com/preowned/Jaeger-LeCoultre-Reverso-Lady-Ultra-Thin-Quartz-3204422-22229",
    //       lang: "en",
    //       source: "prestigetime",
    //     }
    //   }
    // },
    // {
    //   dryRun: false,
    //   payload: {
    //     strategy: "fossil",
    //     command: "extraction",
    //     context: {
    //       entry: "https://www.fossil.com/en-us/products/classic-minute-three-hand-stainless-steel-watch/BQ3455.html",
    //       brand: "Fossil",
    //       brandID: 350,
    //       lang: "en",
    //       source: "official",
    //       base: "https://www.fossil.com/en-us",
    //     }
    //   }
    // },

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
      'origin1',
      Buffer.from(JSON.stringify(job)),
      { replyTo: 'scrape.data.raw', correlationId: shortid.generate() });

    console.log('submitted >', job)

  }

  process.exit(0)

})();