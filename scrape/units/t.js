const { Logger } = require('@cosmos/logger');
const logger = Logger.getLogger(
  'cs:appr:rpscrp',
  process.env.LOG_LEVEL || 'info'
);
const cheerio = require('cheerio');

const scrapeResult = async () => {
  logger.info('Scraper for official price reference - Hamilton');
  // const { client, payload } = context;
  // let { market } = payload;
  let market = 'USA';
  const brandId = 62;
  const type = 'OFFICIAL';
  const tax = 0;
  const price = 0;
  const sourceId = 1;
  let currencyId;
  let urls;
  let results = [];
  let lang;
  switch (market) {
    case 'SGP':
      lang = 'en-sg';
      currencyId = 11;
      break;
    case 'HKG':
      lang = 'zht-hk';
      currencyId = 1;
      break;
    case 'JPN':
      lang = 'ja-jp';
      currencyId = 7;
      break;
    case 'CHN':
      lang = 'zhs-cn';
      currencyId = 20;
      break;
    case 'USA':
    default:
      // website different structure, TODO

      lang = 'US';
      currencyId = 2;
      break;
  }
  if (lang === 'US') {
    //urls = ['https://shop.hamiltonwatch.com/all-hamilton-watches.html?p='];
    // TODO different structure
    urls = [];
  } else {
    if (lang === 'ja-jp') {
      urls = [
        'https://www.hamiltonwatch.com/' +
          lang +
          '/filter-by/men-s-watches.html?p=',
        'https://www.hamiltonwatch.com/' +
          lang +
          '/filter-by/women-watches.html?p=',
      ];
    } else {
      urls = [
        'https://www.hamiltonwatch.com/' +
          lang +
          '/filter-by/mens-watches.html?p=',
        'https://www.hamiltonwatch.com/' +
          lang +
          '/filter-by/women-watches.html?p=',
      ];
    }
  }

  try {
    for (let i = 0; i < urls.length; i++) {
      let cp = 1; // current page
      let pl = [];
      do {
        let link = urls[i] + cp;
        logger.info(link);
        let d = (await client.get(link)).data;
        const $ = cheerio.load(d);

        let j; // holds content of javascript
        $('script').each((idx, el) => {
          j = $(el).contents()['0'];
        });
        // convert content to json
        // format of content window.dataLayer.push({json data});
        // format to extract {json data} and parse to become json
        let jd = JSON.parse(
          j.data.trim().replace('window.dataLayer.push(', '').replace(');', '')
        );
        // get the array of the product list on the page
        pl = jd.ecommerce.impressions;

        pl.forEach((el) => {
          results.push({
            sourceId,
            type,
            market,
            brandId,
            reference: el.id,
            currencyId,
            price,
            tax,
            amount: el.price,
          });
        });
        cp++; // next page
      } while (pl.length === 32); // 32 watches per page, if not equal means last page
    } // for
    return results;
  } catch (error) {
    logger.error('Scraper for official price reference - Hamilton');
    logger.error(error);
    return [];
  }
};

scrapeResult();
