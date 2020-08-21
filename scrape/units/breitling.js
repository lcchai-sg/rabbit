const cheerio = require('cheerio');
const axios = require('axios');

const scrapeResult = async (market = 'SGP') => {
  const brandId = 118;
  let currencyId;
  const type = 'OFFICIAL';
  const price = 0;
  const tax = 0;
  const sourceId = 1;
  let entry;
  switch (market) {
    case 'SGP':
      entry = 'https://www.breitling.com/sg-en/watches/all/';
      currencyId = 11;
      break;
    case 'CHN':
      entry = 'https://www.breitling.com/cn-zh/watches/all/';
      currencyId = 20;
      break;
    case 'JPN':
      entry = 'https://www.breitling.com/jp-en/watches/all/';
      currencyId = 7;
      break;
    case 'HKG':
      entry = 'https://www.breitling.com/hk-en/watches/all/';
      currencyId = 1;
      break;
    case 'USA':
    default:
      entry = 'https://www.breitling.com/us-en/watches/all/';
      currencyId = 2;
      break;
  }
  let result = [];

  try {
    const $ = cheerio.load((await axios.get(entry)).data);
    let pages = JSON.parse($('#app-pages-data').html()).total;
    for (let i=1; i<=pages; i++) {
      const link = entry + '?page=' + i;
      const $$ = cheerio.load((await axios.get(link)).data);
      $$('.soldier.version-soldier').each((idx, el) => {
        const jd = JSON.parse($$(el).find('a').attr('data-gtm-event'));
        const reference = jd.products[0].id;
        const amount = jd.products[0].price;
        result.push({
          sourceId,
          type,
          market,
          brandId,
          reference,
          currencyId,
          price,
          tax,
          amount,
        })
      });
      $$('.soldier.version-configurator').each((idx, el) => {
        const jd = JSON.parse($$(el).find('a').attr('data-gtm-event'));
        const reference = jd.products[0].id;
        const amount = jd.products[0].price;
        result.push({
          sourceId,
          type,
          market,
          brandId,
          reference,
          currencyId,
          price,
          tax,
          amount,
        })
      });
    }
    return result;
  } catch (error) {
    console.log("Scraper for Appraise official price reference [Breitling] - ERROR");
    console.log(error);
    logger.error(error);
    return [];
  }
}

module.exports = scrapeResult;