const { Logger } = require('@cosmos/logger');
const logger = Logger.getLogger('cs:appr:scrapper', 'debug');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

const scrapeResult = async (market = 'SGP') => {
  try {
    logger.info('Scraper for official price reference - IWC');
    const brandId = 4;
    const type = 'OFFICIAL';
    const price = 0;
    const tax = 0;
    const sourceId = 1;
    let currencyId;
    let symbol;
    let results = [];

    switch (market) {
      // TODO simulate the change of countries to get the price from standard website
      // https://www.iwc.com/en/watches.html
      // case 'SGP':
      //   currencyId = 11;
      //   lang = 'en';
      //   symbol = '$';
      //   break;
      // case 'HKG':
      //   currencyId = 1;
      //   lang = 'zh-tw';
      //   symbol = 'HK$';
      //   break;
      // case 'CHN':
      //   currencyId = 20;
      //   lang = '';
      //   break;
      case 'JPN':
        currencyId = 7;
        lang = 'ja';
        symbol = '￥';
        break;
      case 'USA':
      default:
        currencyId = 2;
        lang = 'us/en';
        symbol = '$';
        break;
    }
    let entry = 'https://www.iwc.com/' + lang + '/watches.html';
    logger.info(entry);
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(entry);
    const data = await page.evaluate(() => document.body.innerHTML);
    let $ = cheerio.load(data);
    $('.iwc-finder-result-product').each((idx, el) => {
      let reference = $(el).attr('data-product-ref');
      let prc = $(el, '.iwc-product-fromprice')
        .text()
        .replace(/(?:\r\n|\r|\n|\s+)/g, ' ')
        .trim()
        .split(symbol)[1];
      if (prc) {
        amount = prc.split(' ')[0].replace(/,/g, '');
      } else {
        amount = 0;
      }

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
    logger.error('Scraper for official price reference - IWC');
    logger.error(error);
    return [];
  }
};

module.exports = scrapeResult;
