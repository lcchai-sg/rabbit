const { Logger } = require('@cosmos/logger');
const { MessageStation } = require("@cosmos/utils");
const shortid = require('shortid');

const logger = Logger.getLogger('cs:syno:urls', 'debug');
(async function () {
  logger.info('Scraper');
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

  const jobs = [
    // HYT indexing
    {
      "dryRun": false,
      "payload": {
        "base": "https://www.hytwatches.com",
        "strategy": "hyt",
        "command": "indexing",
        "context": {
          "source": "official",
          "entry": "https://www.hytwatches.com/models",
          "brand": "HYT",
          "brandID": 310,
          "lang": "en",
        }
      }
    },
    // Seiko indexing
    {
      "dryRun": false,
      "payload": {
        "base": "https://www.seikowatches.com",
        "strategy": "seiko",
        "command": "indexing",
        "context": {
          "source": "official",
          "entry": "https://www.seikowatches.com/sitemap.xml",
          "brand": "Seiko",
          "brandID": 72,
          "lang": "en",
        }
      }
    },
    // A. Lange & Söhne indexing
    {
      "dryRun": false,
      "payload": {
        "base": "https://www.alange-soehne.com/en",
        "strategy": "alange",
        "command": "newIndexing",
        "context": {
          "source": "official",
          "entry": "https://www.alange-soehne.com/en/sitemap.xml",
          "brand": "A. Lange & Söhne",
          "brandID": 293,
          "lang": "en",
        }
      }
    },
    // citizen indexing
    {
      "dryRun": false,
      "payload": {
        "base": "https://www.citizenwatch.com",
        "strategy": "citizen",
        "command": "indexing",
        "context": {
          "source": "official",
          "entry": "https://www.citizenwatch.com/sitemap_0.xml",
          "brand": "Citizen",
          "brandID": 86,
          "lang": "en",
        }
      }
    },
    // about vintage indexing
    {
      "dryRun": false,
      "payload": {
        "base": "https://aboutvintage.com",
        "strategy": "aboutvintage",
        "command": "newIndexing",
        "context": {
          "source": "official",
          "entry": "https://aboutvintage.com/collections/",
          "brand": "About Vintage",
          "brandID": 152,
          "lang": "en",
        }
      }
    },
    // cvstos indexing
    {
      "dryRun": false,
      "payload": {
        "base": "https://www.cvstos.com",
        "strategy": "cvstos",
        "command": "indexing",
        "context": {
          "source": "official",
          "entry": "https://www.cvstos.com/collections/collections",
          "brand": "Cvstos",
          "brandID": 186,
          "lang": "en",
        }
      }
    },
    // Michael Kors indexing
    {
      "dryRun": false,
      "payload": {
        "base": "https://www.michaelkors.global/",
        "strategy": "michaelkors",
        "command": "indexing",
        "context": {
          "source": "official",
          "entry": "https://www.michaelkors.global/en_SG/product-image-sitemap_en_SG.xml",
          "brand": "Michael Kors",
          "brandID": 190,
          "lang": "en",
        }
      }
    },
    // Memorigin indexing
    {
      "dryRun": false,
      "payload": {
        "base": "https://www.memorigin.com/mem_1dot1/",
        "strategy": "memorigin",
        "command": "indexing",
        "context": {
          "source": "official",
          "entry": "https://www.memorigin.com/mem_1dot1/libs/getSeries.php?lang=eng",
          "brand": "Memorigin",
          "brandID": 256,
          "lang": "en",
        }
      }
    },
    // Muehle Glasshuette indexing
    {
      "dryRun": false,
      "payload": {
        "base": "https://www.muehle-glashuette.de/",
        "strategy": "muehle",
        "command": "indexing",
        "context": {
          "source": "official",
          "entry": "https://www.muehle-glashuette.de/en/",
          "brand": "Muehle Glasshuette",
          "brandID": 292,
          "lang": "en",
        }
      }
    },
    // Audemars Piguet indexing
    {
      "dryRun": false,
      "payload": {
        "base": 'https://www.audemarspiguet.com',
        "strategy": "audemarspiguet",
        "command": "indexing",
        "context": {
          "source": "official",
          "entry": 'https://www.audemarspiguet.com/en/sitemapxml/watch-browser/',
          "brand": "Audemars Piguet",
          "brandID": 18,
          "lang": "en",
        }
      }
    },
    // Vacheron Constantin indexing
    {
      "dryRun": false,
      "payload": {
        "base": "https://www.vacheron-constantin.com",
        "strategy": "vacheronconstantin",
        "command": "indexing",
        "context": {
          "source": "official",
          "entry": "https://www.vacheron-constantin.com/en/sitemap.xml",
          "brand": "Vacheron Constantin",
          "brandID": 3,
          "lang": "en",
        }
      }
    },
    // Montblanc indexing
    {
      "dryRun": false,
      "payload": {
        "base": "https://www.montblanc.com",
        "strategy": "montblanc",
        "command": "indexing",
        "context": {
          "source": "official",
          "entry": "https://www.montblanc.com/en-us/categories/watches",
          "brand": "Montblanc",
          "brandID": 5,
          "lang": "en",
        }
      }
    },
    // Girard-Perregaux indexing
    {
      "dryRun": false,
      "payload": {
        "base": "https://www.girard-perregaux.com",
        "strategy": "girardperregaux",
        "command": "indexing",
        "context": {
          "source": "official",
          "entry": "https://www.girard-perregaux.com/row_en",
          "brand": "Girard Perregaux",
          "brandID": 98,
          "lang": "en",
        }
      }
    },
    // panerai indexing
    {
      "dryRun": false,
      "payload": {
        "base": "https://www.panerai.com",
        "strategy": "panerai",
        "command": "indexing",
        "context": {
          "source": "official",
          "entry": "https://www.panerai.com/en/collections/watch-collection.html",
          "brand": "Panerai",
          "brandID": 58,
          "lang": "en",
        }
      }
    },
    // frederique constant indexing
    {
      "dryRun": false,
      "payload": {
        "base": "https://frederiqueconstant.com",
        "strategy": "frederiqueconstant",
        "command": "indexing",
        "context": {
          "source": "official",
          "entry": "https://frederiqueconstant.com/sitemap.xml",
          "brand": "Frederique Constant",
          "brandID": 154,
          "lang": "en",
        }
      }
    },
    // zenith indexing
    {
      "dryRun": false,
      "payload": {
        "base": "https://www.zenith-watches.com",
        "strategy": "zenith",
        "command": "indexing",
        "context": {
          "source": "official",
          "entry": "https://www.zenith-watches.com/en_us/sitemap_2-product.xml",
          "brand": "Zenith",
          "brandID": 80,
          "lang": "en",
        }
      }
    },
    // cartier indexing
    {
      "dryRun": false,
      "payload": {
        "base": "https://www.cartier.com",
        "strategy": "cartier",
        "command": "indexing",
        "context": {
          "source": "official",
          "entry": "https://www.cartier.com/en-gb/watches",
          "brand": "Cartier",
          "brandID": 28,
          "lang": "en",
        }
      }
    },
    // sevenfriday indexing
    {
      "dryRun": false,
      "payload": {
        "base": "https://www.sevenfriday.com/",
        "strategy": "sevenfriday",
        "command": "indexing",
        "context": {
          "source": "official",
          "entry": "https://www.sevenfriday.com/homepage.aspx",
          "brand": "Sevenfriday",
          "brandID": 142,
          "lang": "en",
        }
      }
    },
    // patek phillipe indexing
    {
      "dryRun": false,
      "payload": {
        "base": "https://www.patek.com/",
        "strategy": "patek",
        "command": "indexing",
        "context": {
          "source": "official",
          "entry": "https://www.patek.com/en/home",
          "brand": "Patek Philippe",
          "brandID": 22,
          "lang": "en",
        }
      }
    },
    // gaga milano indexing
    {
      "dryRun": false,
      "payload": {
        "base": "https://gagamilano.com",
        "strategy": "gagamilano",
        "command": "indexing",
        "context": {
          "source": "official",
          "entry": "https://gagamilano.com/collections/",
          "brand": "Gaga Milano",
          "brandID": 96,
          "lang": "en",
        }
      }
    },
    // gucci indexing
    {
      "dryRun": false,
      "payload": {
        "base": "https://www.gucci.com",
        "strategy": "gucci",
        "command": "indexing",
        "context": {
          "source": "official",
          "entry": "https://www.gucci.com/us/en/ca/jewelry-watches/watches-c-jewelry-watches-watches/",
          "brand": "Gucci",
          "brandID": 156,
          "lang": "en",
        }
      }
    },
    // jaquet droz indexing
    {
      "dryRun": false,
      "payload": {
        "base": "https://www.jaquet-droz.com/",
        "strategy": "jaquetdroz",
        "command": "indexing",
        "context": {
          "source": "official",
          "entry": "https://www.jaquet-droz.com/en/watches",
          "brand": "Jaquet Droz",
          "brandID": 174,
          "lang": "en",
        }
      }
    },
    // orient indexing
    {
      "dryRun": false,
      "payload": {
        "base": "https://www.orientwatchusa.com",
        "strategy": "orient",
        "command": "indexing",
        "context": {
          "source": "official",
          "entry": "https://www.orientwatchusa.com",
          "brand": "Orient",
          "brandID": 100,
          "lang": "en",
        }
      }
    },
    // oris indexing
    {
      "dryRun": false,
      "payload": {
        "base": "https://www.oris.ch/watch/",
        "strategy": "oris",
        "command": "indexing",
        "context": {
          "source": "official",
          "entry": "https://www.oris.ch/api/en/home/getcollections",
          "brand": "Oris",
          "brandID": 164,
          "lang": "en",
        }
      }
    },
    // nomos indexing
    {
      "dryRun": false,
      "payload": {
        "base": "https://nomos-glashuette.com",
        "strategy": "nomosglashuette",
        "command": "indexing",
        "context": {
          "source": "official",
          "entry": "https://nomos-glashuette.com/en/watchfinder",
          "brand": "Nomos Glashuette",
          "brandID": 134,
          "lang": "en",
        }
      }
    },
    // jaeger lecouultre indexing
    {
      "dryRun": false,
      "payload": {
        "base": "https://www.jaeger-lecoultre.com",
        "strategy": "jaegerlecoultre",
        "command": "indexing",
        "context": {
          "source": "official",
          "entry": "https://www.jaeger-lecoultre.com/us/en/home-page.html",
          "brand": "Jaeger LeCoultre",
          "brandID": 16,
          "lang": "en",
        }
      }
    },
    // glashuette original indexing
    {
      "dryRun": false,
      "payload": {
        "base": "https://www.glashuette-original.com/",
        "strategy": "glashuette",
        "command": "indexing",
        "context": {
          "source": "official",
          "entry": "https://www.glashuette-original.com/",
          "brand": "Glashuette Original",
          "brandID": 168,
          "lang": "en",
        }
      }
    },
    // briston indexing
    {
      "dryRun": false,
      "payload": {
        "base": "",
        "strategy": "briston",
        "command": "indexing",
        "context": {
          "source": "official",
          "entry": "https://www.briston-watches.com/en/watches/",
          "brand": "Briston",
          "brandID": 282,
          "lang": "en",
        }
      }
    },
    // alpina indexing
    {
      "dryRun": false,
      "payload": {
        "base": "",
        "strategy": "alpina",
        "command": "newIndexing",
        "context": {
          "source": "official",
          "entry": "https://alpinawatches.com/sitemap_products_1.xml?from=4802581004426&to=5853158637730",
          "brand": "Alpina",
          "brandID": 288,
          "lang": "en",
        }
      }
    },
    // Chopard indexing
    {
      "dryRun": false,
      "payload": {
        "base": "https://www.chopard.com",
        "strategy": "chopard",
        "command": "indexing",
        "context": {
          "source": "official",
          "entry": "https://www.chopard.com/us/watches",
          "brand": "Chopard",
          "brandID": 44,
          "lang": "en",
        }
      }
    },
    // Baume et Mercier indexing
    {
      "dryRun": false,
      "payload": {
        "base": "https://www.baume-et-mercier.com/us/en",
        "strategy": "baumemercier",
        "command": "indexing",
        "context": {
          "source": "official",
          "entry": "https://www.baume-et-mercier.com/us/en/sitemap.xml",
          "brand": "Baume et Mercier",
          "brandID": 178,
          "lang": "en",
        }
      }
    },
    // Marc Jacobs indexing
    {
      "dryRun": false,
      "payload": {
        "base": "https://www.marcjacobs.com",
        "strategy": "marcjacobs",
        "command": "indexing",
        "context": {
          "source": "official",
          "entry": //"https://www.marcjacobs.com/sitemap_0.xml",
            "https://www.marcjacobs.com/the-marc-jacobs/the-accessories/watches/?start=0&sz=100",
          "brand": "Marc Jacobs",
          "brandID": 214,
          "lang": "en",
        }
      }
    },
    // Piaget indexing
    {
      "dryRun": false,
      "payload": {
        "base": "https://www.piaget.com",
        "strategy": "piaget",
        "command": "indexing",
        "context": {
          "source": "official",
          "entry": "https://www.piaget.com/sitemap.xml",
          "brand": "Piaget",
          "brandID": 56,
          "lang": "en",
        }
      }
    },
    // Ball indexing
    {
      "dryRun": false,
      "payload": {
        "base": "https://shop.ballwatch.ch",
        "strategy": "ball",
        "command": "newIndexing",
        "context": {
          "source": "official",
          "entry": "https://shop.ballwatch.ch/en/watchfinder",
          "brand": "Ball",
          "brandID": 188,
          "lang": "en",
        }
      }
    },
    // LV indexing
    {
      "dryRun": false,
      "payload": {
        "base": "https://us.louisvuitton.com",
        "strategy": "lv",
        "command": "indexing",
        "context": {
          "source": "official",
          "entry": "",
          "brand": "Louis Vuitton",
          "brandID": 130,
          "lang": "en",
        }
      }
    },
    // Hugo Boss indexing
    {
      "dryRun": false,
      "payload": {
        "base": "https://www.hugoboss.com",
        "strategy": "hugoboss",
        "command": "indexing",
        "context": {
          "source": "official",
          "entry": "",
          "brand": "Hugo Boss",
          "brandID": 192,
          "lang": "en",
        }
      }
    },
    // Emporio Armani indexing
    {
      "dryRun": false,
      "payload": {
        "base": "",
        "strategy": "armani",
        "command": "newIndexing",
        "context": {
          "source": "official",
          "entry": "",
          "brand": "Emporio Armani",
          "brandID": 218,
          "lang": "en",
        }
      }
    },
    //  meistersinger indexing
    {
      "dryRun": false,
      "payload": {
        "base": "",
        "strategy": "meistersinger",
        "command": "indexing",
        "context": {
          "source": "official",
          "entry": "https://meistersinger.us/shop-tagged/single-hand-watch/",
          "brand": "MeisterSinger",
          "brandID": 280,
          "lang": "en",
        }
      }
    },
    // longines indexing
    {
      "dryRun": false,
      "payload": {
        "base": "",
        "strategy": "longines",
        "command": "indexing",
        "context": {
          "source": "official",
          "entry": "https://www.longines.com/en-us/watches",
          "brand": "Longines",
          "brandID": 120,
          "lang": "en",
        }
      }
    },
    // ulysse nardin indexing
    {
      "dryRun": false,
      "payload": {
        "base": "https://www.ulysse-nardin.com/row_en",
        "strategy": "ulysse",
        "command": "indexing",
        "context": {
          "source": "official",
          "entry": "https://www.ulysse-nardin.com/row_en/",
          "brand": "Ulysse Nardin",
          "brandID": 162,
          "lang": "en",
        }
      }
    },
    // maurice lacroix indexing
    {
      "dryRun": false,
      "payload": {
        "base": "https://www.mauricelacroix.com",
        "strategy": "mauricelacroix",
        "command": "indexing",
        "context": {
          "source": "official",
          "entry": "https://www.mauricelacroix.com/media/sitemap_us_en.xml",
          "brand": "Maurice Lacroix",
          "brandID": 26,
          "lang": "en",
        }
      }
    },
    // breitling indexing
    {
      "dryRun": false,
      "payload": {
        "base": "https://www.breitling.com",
        "strategy": "breitling",
        "command": "indexing",
        "context": {
          "source": "official",
          "entry": "https://www.breitling.com/us-en/sitemap/collections.xml",
          "brand": "Breitling",
          "brandID": 118,
          "lang": "en",
        }
      }
    },
    // parmigiani indexing
    {
      "dryRun": false,
      "payload": {
        "base": "https://www.parmigiani.com",
        "strategy": "parmigiani",
        "command": "indexing",
        "context": {
          "source": "official",
          "entry": "https://www.parmigiani.com/en/",
          "brand": "Parmigiani Fleurier",
          "brandID": 158,
          "lang": "en",
        }
      }
    },
    // bulova indexing
    {
      "dryRun": false,
      "payload": {
        "base": "https://intl.bulova.com",
        "strategy": "bulova",
        "command": "indexing",
        "context": {
          "source": "official",
          "entry": "https://intl.bulova.com/sitemap_products_1.xml?from=4298068545&to=4254557372463",
          "brand": "Bulova",
          "brandID": 268,
          "lang": "en",
        }
      }
    },
    // hublot indexing
    {
      "dryRun": false,
      "payload": {
        "base": "https://www.hublot.com",
        "strategy": "hublot",
        "command": "indexing",
        "context": {
          "source": "official",
          "entry": "https://www.hublot.com/en-us/watches",
          "brand": "Hublot",
          "brandID": 46,
          "lang": "en",
        }
      }
    },
    // Skagen indexing
    {
      "dryRun": false,
      "payload": {
        "base": "https://www.skagen.com/en-us",
        "strategy": "Skagen",
        "command": "indexing",
        "context": {
          "source": "official",
          "entry": "https://www.skagen.com/en-us/sitemap/",
          "brand": "Skagen",
          "brandID": 240,
          "lang": "en",
        }
      }
    },
    // Tudor indexing
    {
      "dryRun": false,
      "payload": {
        "base": "https://www.tudorwatch.com",
        "strategy": "tudor",
        "command": "indexing",
        "context": {
          "source": "official",
          "entry": "https://www.tudorwatch.com/sitemap-en.xml",
          "brand": "Tudor",
          "brandID": 2,
          "lang": "en",
        }
      }
    },
    // Rado indexing
    {
      "dryRun": false,
      "payload": {
        "base": "https://www.rado.com",
        "strategy": "rado",
        "command": "indexing",
        "context": {
          "source": "official",
          "entry": "https://www.rado.com/sitemap.xml",
          "brand": "Rado",
          "brandID": 160,
          "lang": "en",
        }
      }
    },
    // Omega indexing
    {
      "dryRun": false,
      "payload": {
        "base": "https://www.omegawatches.com/en-us",
        "strategy": "omega",
        "command": "indexing",
        "context": {
          "source": "official",
          "entry": "https://www.omegawatches.com/en-us/watches",
          "brand": "Omega",
          "brandID": 20,
          "lang": "en",
        }
      }
    },
    // Rolex indexing
    {
      "dryRun": false,
      "payload": {
        "base": "https://www.rolex.com",
        "strategy": "rolex",
        "command": "indexing",
        "context": {
          "source": "official",
          "entry": "https://www.rolex.com/en/sitemap.xml",
          "brand": "Rolex",
          "brandID": 1,
          "lang": "en",
        }
      }
    },
    // chanel indexing
    {
      "dryRun": false,
      "payload": {
        "base": "https://www.chanel.com",
        "strategy": "chanel",
        "command": "indexing",
        "context": {
          "source": "official",
          "entry": "https://www.chanel.com/us/",
          "brand": "Chanel",
          "brandID": 70,
          "lang": "en",
        }
      }
    },
    // Tissot Indexing
    {
      "dryRun": false,
      "payload": {
        "base": "https://www.tissotwatches.com",
        "strategy": "tissot",
        "command": "indexing",
        "context": {
          "source": "official",
          "entry": "https://www.tissotwatches.com/media/sitemap/sitemap_en_en.xml",
          "brand": "Tissot",
          "brandID": 82,
          "lang": "en",
        }
      }
    },
    // Tag Heuer indexing
    {
      "dryRun": false,
      "payload": {
        "base": "https://www.tagheuer.com/us/en",
        "strategy": "tagheuer",
        "command": "indexing",
        "context": {
          "source": "official",
          "entry": "https://www.tagheuer.com/us/en/sitemap_1-image.xml",
          "brand": "Tag Heuer",
          "brandID": 54,
          "lang": "en",
        }
      }
    },
    // IWC indexing
    {
      "dryRun": false,
      "payload": {
        "base": "https://www.iwc.com",
        "strategy": "iwc",
        "command": "indexing",
        "context": {
          "source": "official",
          "entry": "https://www.iwc.com/en.sitemap.xml",
          "brand": "IWC",
          "brandID": 4,
          "lang": "en",
        }
      }
    },
    // tommy hilfiger indexing
    {
      "dryRun": false,
      "payload": {
        "base": "https://usa.tommy.com",
        "strategy": "tommyhilfiger",
        "command": "indexing",
        "context": {
          "source": "official",
          "entry": "https://usa.tommy.com/static/sitemap.xml",
          "brand": "Tommy Hilfiger",
          "brandID": 252,
          "lang": "en",
        }
      }
    },
    // bvlgari indexing
    {
      "dryRun": false,
      "payload": {
        "base": "https://www.bulgari.com",
        "strategy": "bulgari",
        "command": "indexing",
        "context": {
          "source": "official",
          "entry": "https://www.bulgari.com/en-us/watches/",
          "brand": "Bvlgari",
          "brandID": 32,
          "lang": "en",
        }
      }
    },
    // breuget indexing
    {
      "dryRun": false,
      "payload": {
        "base": "https://www.breguet.com",
        "strategy": "breguet",
        "command": "indexing",
        "context": {
          "source": "official",
          "entry": "https://www.breguet.com/en/timepieces",
          "brand": "Breguet",
          "brandID": 132,
          "lang": "en",
        }
      }
    },
    // bell & ross indexing
    {
      "dryRun": false,
      "payload": {
        "base": "https://www.bellross.com",
        "strategy": "bellross",
        "command": "indexing",
        "context": {
          "source": "official",
          "entry": "https://www.bellross.com/our-collections",
          "brand": "Bell & Ross",
          "brandID": 112,
          "lang": "en",
        }
      }
    },
    // blancpain indexing
    {
      "dryRun": false,
      "payload": {
        "base": "https://www.blancpain.com",
        "strategy": "blancpain",
        "command": "indexing",
        "context": {
          "source": "official",
          "entry": "https://www.blancpain.com/en/product-finder",
          "brand": "Blancpain",
          "brandID": 52,
          "lang": "en",
        }
      }
    },
    // casio indexing
    {
      "dryRun": false,
      "payload": {
        "base": "https://www.casio.com",
        "strategy": "casio",
        "command": "indexing",
        "context": {
          "source": "official",
          "entry": "https://www.casio.com/products/watches",
          "brand": "Casio",
          "brandID": 76,
          "lang": "en",
        }
      }
    },
    // grand-seiko indexing
    {
      "dryRun": false,
      "payload": {
        "base": "https://www.grand-seiko.com/us-en/collections/",
        "strategy": "grand-seiko",
        "command": "indexing",
        "context": {
          "source": "official",
          "entry": "https://www.grand-seiko.com/__api/posts/list",
          "brand": "Grand Seiko",
          "brandID": 84,
          "lang": "en",
        }
      }
    },
    {
      "dryRun": false,
      "payload": {
        "base": "https://www.guess.com/us/en",
        "strategy": "guess",
        "command": "indexing",
        "context": {
          "source": "official",
          "entry": "https://www.guess.com/us/en",
          "brand": "Guess",
          "brandID": 250,
          "lang": "en",
        }
      }
    },
    {
      "dryRun": false,
      "payload": {
        "base": "https://shop.diesel.com",
        "strategy": "diesel",
        "command": "indexing",
        "context": {
          "source": "official",
          "entry": "https://shop.diesel.com/en/home",
          "brand": "Diesel",
          "brandID": 244,
          "lang": "en"
        }
      }
    },
    {
      "dryRun": false,
      "payload": {
        "base": "https://www.tutima.com",
        "strategy": "tutima",
        "command": "indexing",
        "context": {
          "source": "official",
          // "entry": "https://tutima.com/sitemaps.xml", old
          "entry": "https://tutima.com/wp-sitemap-posts-product-1.xml",
          "brand": "Tutima",
          "brandID": 254,
          "lang": "en"
        }
      }
    },
    {
      "dryRun": false,
      "payload": {
        "base": "https://www.hamiltonwatch.com/en-us",
        "strategy": "hamilton",
        "command": "indexing",
        "context": {
          "source": "official",
          "entry": "https://www.hamiltonwatch.com/pub/mediam2/sitemap/sitemap_en_us.xml",
          "brand": "Hamilton",
          "brandID": 62,
          "lang": "en"
        }
      }
    },
    // mido sitemap indexing
    {
      "dryRun": false,
      "payload": {
        "base": "https://www.midowatches.com/us/",
        "strategy": "mido",
        "command": "xmlIndexing",
        "context": {
          "source": "official",
          "entry": "https://www.midowatches.com/us/sitemap.xml",
          "brand": "mido",
          "brandID": 172,
          "lang": "en"
        }
      }
    },
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
    {
      "dryRun": false,
      "payload": {
        "base": "https://www.sinn.de",
        "strategy": "sinn",
        "command": "indexing",
        "context": {
          "source": "official",
          "entry": "https://www.sinn.de/en/",
          "brand": "sinn",
          "brandID": 180,
          "lang": "en"
        }
      }
    },
    // prestigetime
    // {
    //   "dryRun": false,
    //   "payload": {
    //     "base": "https://www.prestigetime.com",
    //     "strategy": "prestigetime",
    //     "command": "indexing",
    //     "context": {
    //       "source": "prestigetime",
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
    //     "strategy": "watchesofmayfairB",
    //     "command": "newIndexing",
    //     "context": {
    //       "entry": "https://watchesofmayfair.com/watches?product_list_limit=59",
    //       "lang": "en"
    //     }
    //   }
    // },
    // watchesofmayfair sitemap
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
    // kechiq
    // {
    //   "dryRun": false,
    //   "payload": {
    //     "base": "https://www.kechiq.com",
    //     "strategy": "kechiq",
    //     "command": "indexing",
    //     "context": {
    //       "entry": "http://www.kechiq.com/sitemapUS.xml",
    //       "source": "kechiq",
    //       "lang": "en",
    //     }
    //   }
    // },
    // {
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
    // }
  ];

  for (const job of jobs) {
    logger.debug('Start Jobs');
    // indexing 
    await channel.publish(
      'scraperB',
      'crawlerB',
      Buffer.from(JSON.stringify(job)),
      { replyTo: 'collector', correlationId: shortid.generate() });

    // extract product
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

    console.log('submitted >', job)

  }

  process.exit(0)

})();