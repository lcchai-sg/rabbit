const { Logger } = require('@cosmos/logger');
const logger = Logger.getLogger(
  'cs:appr:rpscrp',
  process.env.LOG_LEVEL || 'info'
);
const cheerio = require('cheerio');
const axios = require('axios');

const scrapeResult = async (context) => {
  // TODO test geolocation using proxy
  //https://www.omegawatches.com/en-us/watchfinder?p=2  USA
  //https://www.omegawatches.com.hk/zh/watchfinder  HKG
  //https://www.omegawatches.cn/cn/watchfinder CHN
  //https://www.omegawatches.jp/ja/watchfinder JPN

  //https://www.omegawatches.com/catalog/ajax/price/?product_ids=6783
  logger.info('Scraper for official price reference - Omega');
  const { client, payload } = context;
  let { market } = payload;
  const entry = 'https://www.omegawatches.com/en-us/watchfinder';
  const brandId = 20;
  const type = 'OFFICIAL';
  const tax = 0;
  const price = 0;
  const sourceId = 1;

  let results = [];

  try {
    logger.info(entry);
    const $ = cheerio.load((await client.get(entry)).data);
    const numWatches = parseInt(
      $('.product-list-counter')
        .text()
        .replace(/(?:\r\n|\r|\n|\s+)/g, ' ')
        .trim()
        .split(' ')[0]
    );
    const numPages = Math.ceil(numWatches / 24);
    for (let i = 0; i <= numPages; i++) {
      let link = entry + '?p=' + i;
      logger.info(link);
      const $$ = cheerio.load((await client.get(link)).data);
      $$('script').each((idx, el) => {
        let ty = $$(el).attr('type');
        if (ty == 'application/ld+json') {
          let data = $$(el).contents();
          data = JSON.parse(data);
          if (data['@type'] === 'Product') {
            let reference = data.sku;
            let currency =
              data.offers && data.offers.priceCurrency
                ? data.offers.priceCurrency
                : '';
            switch (currency) {
              case 'SGD':
                currencyId = 11;
                market = 'SGP';
                break;
              case 'CNY':
                currencyId = 20;
                market = 'CHN';
                break;
              case 'JPY':
                currencyId = 7;
                market = 'JPN';
                break;
              case 'HKD':
                currencyId = 1;
                market = 'HKG';
                break;
              case 'USD':
              default:
                currencyId = 2;
                market = 'USA';
                break;
            }
            let amount =
              data.offers && data.offers.price
                ? parseFloat(data.offers.price)
                : 0;
            results.push({
              sourceId,
              type,
              market,
              brandId,
              reference,
              currencyId,
              price,
              tax,
              amount,
            });
          } // if product
        } // if type
      }); // each
      return results;
    } // for
    return results;
  } catch (error) {
    logger.error('Scraper for official price reference - Omega');
    logger.error(error);
    return [];
  }
};

(async () => {
  let r = await scrapeResult({
    client: axios,
    payload: {
      market: 'USA'
    }
  });
  console.log(r);
})();