const { Logger } = require('@cosmos/logger');
const logger = Logger.getLogger('cs:appr:scrapper', 'debug');
const axios = require('axios');
const cheerio = require('cheerio');

// https://www.tagheuer.com/jp/en/timepieces/let-us-guide-you/our-watches/    jp
// https://www.tagheuer.com/hk/en/timepieces/let-us-guide-you/our-watches/    hk
// https://www.tagheuer.com/sg/en/timepieces/let-us-guide-you/our-watches/    sg
// https://www.tagheuer.com/us/en/timepieces/let-us-guide-you/our-watches/    us
// https://www.tagheuer.com/cn/en/timepieces/let-us-guide-you/our-watches/    cn

const scrapeResult = async (market = 'SGP') => {
  logger.info('Scraper for official price reference - Tag Heuer');
  const brandId = 54;
  const type = 'OFFICIAL';
  const tax = 0;
  const price = 0;
  const sourceId = 1;
  let currencyId;
  let results = [];
  let lang;
  switch (market) {
    case 'SGP':
      lang = 'sg';
      currencyId = 11;
      break;
    case 'HKG':
      lang = 'hk';
      currencyId = 1;
      break;
    case 'JPN':
      lang = 'jp';
      currencyId = 7;
      break;
    case 'CHN':
      lang = 'cn';
      currencyId = 20;
      break;
    case 'USA':
    default:
      lang = 'us';
      currencyId = 2;
      break;
  }
  let entry =
    'https://www.tagheuer.com/' +
    lang +
    '/en/timepieces/let-us-guide-you/our-watches/?start=0&sz=1000'; // load 1000 watches

  try {
    logger.info(entry);
    const d = (await axios.get(entry)).data;
    const $ = cheerio.load(d);

    $('.product-tile').each((idx, el) => {
      let j = JSON.parse($(el).attr('data-gtmdata'));
      let reference = j.id;
      let amount = j.price;

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
    });
    return results;
  } catch (error) {
    logger.error('Scraper for official price reference - Tag Heuer');
    logger.error(error);
    return [];
  }
};

module.exports = scrapeResult;
