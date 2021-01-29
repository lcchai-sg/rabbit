const { CloudFront } = require('aws-sdk');
const axios = require('axios');
const cheerio = require('cheerio');
const sitemapper = require('sitemapper');
const { Mappers, } = require('./utils');

const indexing = async (context) => {
  const { client, entry, } = context;
  const source = "official";
  const lang = "en";
  const brand = "Skagen";
  const brandID = 240;
  const result = { source, lang, brand, brandID, collections: [], items: {} };
  try {
    const sitemap = new sitemapper({
      url: entry,
      timeout: 300000,
    });
    const d = await sitemap.fetch();
    d.sites.forEach(url => {
      if (url.match(/product/i) && url.match(/\bwatch\b/i) && (!(url.match(/band|watch-strap/i)))) {
        const u = url.split('/');
        const reference = u[u.length - 1].toUpperCase().replace('.HTML', '').trim();
        const name = u[u.length - 2].toUpperCase().split('-').join(' ');
        const collection = u[u.length - 2].toUpperCase().split('-')[0];
        if (result.collections.indexOf(collection) < 0) {
          result.collections.push(collection);
          result.items[collection] = [];
        }
        result.items[collection].push({
          source, lang, brand, brandID, url, name, reference, collection, retail: null,
        });
      }
    });
    return result;
  } catch (error) {
    console.error('Failed indexing for Skagen with error : ' + error)
    return {};
  }
}

const extraction = async (context) => {
  const { client, entry, ...rest } = context;
  const result = { ...rest, url: entry, spec: [], related: [], }
  try {
    const data = (await client.get(entry)).data;
    const $ = cheerio.load(data);
    result.source = "official";
    result.lang = "en";
    result.brand = "Skagen";
    result.brandID = 240;
    $('script[type="application/ld+json"]').each((idx, el) => {
      const d = $(el).contents().toString();
      const jd = JSON.parse(d);
      const j = jd[0];
      result.name = j.name;
      result.thumbnail = j.image ? j.image[0] : null;
      result.reference = j.sku;
      if (j.offers) {
        const currency = j.offers.priceCurrency;
        if (j.offers.highPrice) result.retail = currency + ' ' + j.offers.highPrice;
        if (j.offers.lowPrice) result.price = currency + ' ' + j.offers.lowPrice;
      }
    })
    let key = ""; let value = "";
    $('.attribute').each((idx, el) => {
      key = $(el).find('.label').text().trim();
      value = $(el).find('.value').text().trim();
      result.spec.push({ key, value, });
    })
  } catch (error) {
    logger.error('Failed extraction for Skagen with error : ' + error);
    logger.error('entry : ', entry);
    if (error.response) result.code = error.response.status;
    else result.code = 'UNKNOWN ERROR';
  }
  return result;
};


(async () => {
  // const r = await indexing({
  //   client: axios,
  //   entry: "https://www.skagen.com/en-us/sitemap_index.xml",
  //   base: "https://www.skagen.com/en-us/",
  // })
  // console.log(r);
  // let cnt = 0;
  // r.collections.forEach(c => {
  //   console.log('collection ...', c);
  //   r.items[c].forEach(w => {
  //     console.log(w);
  //     cnt++;
  //   })
  // })
  // console.log('number of watches : ', cnt);

  const r = [
    {
      "lang": "en",
      "source": "official",
      "url": "https://www.skagen.com/en-us/products/norre-three-hand-brown-leather-watch/SKW6680.html",
      "brand": "Skagen",
      "brandID": 240,
      "collection": "NORRE",
      "name": "NORRE THREE HAND BROWN LEATHER WATCH",
      "reference": "SKW6680",
      "retail": null
    },
    {
      "lang": "en",
      "source": "official",
      "url": "https://www.skagen.com/en-us/products/norre-three-hand-green-nylon-watch/SKW6681.html",
      "brand": "Skagen",
      "brandID": 240,
      "collection": "NORRE",
      "name": "NORRE THREE HAND GREEN NYLON WATCH",
      "reference": "SKW6681",
      "retail": null
    },
    {
      "lang": "en",
      "source": "official",
      "url": "https://www.skagen.com/en-us/products/norre-three-hand-silver-tone-steel-mesh-watch/SKW6682.html",
      "brand": "Skagen",
      "brandID": 240,
      "collection": "NORRE",
      "name": "NORRE THREE HAND SILVER TONE STEEL MESH WATCH",
      "reference": "SKW6682",
      "retail": null
    }
  ];

  for (let i = 0; i < r.length; i++) {
    const ex = await extraction({
      client: axios,
      entry: r[i].url,
      base: "https://www.skagen.com/en-us/",
    });
    console.log(ex);
  }
})();