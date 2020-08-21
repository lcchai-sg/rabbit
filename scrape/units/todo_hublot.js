const { Logger } = require('@cosmos/logger');
const logger = Logger.getLogger('cs:appr:scrapper', 'debug');
const axios = require('axios');
const cheerio = require('cheerio');

const scrapeResult = async (market = 'SGP') => {
  logger.info('Scraper for official price reference - Hublot');
  const brandId = 46;
  const type = 'OFFICIAL';
  const tax = 0;
  const price = 0;
  const sourceId = 1;
  let currencyId = 2;
  let entry = 'https://www.hublot.com/en/find-your-hublot';
  market = 'USA'; // only found USD prices
  let results = [];

  try {
    logger.info(entry);
    const d = (await axios.get(entry)).data;
    const $ = cheerio.load(d);
    $('.container .product-list').each((idx, el) => {
      let url = $(el).find('a').attr('href');
      console.log(idx, url);
    });
    /*
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
    */
  } catch (error) {
    logger.error('Scraper for official price reference - Hublot');
    logger.error(error);
    return [];
  }
};

scrapeResult('USA');
