const { Logger } = require('@cosmos/logger');
const logger = Logger.getLogger('cs:appr:scrapper', 'debug');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

const scrapeResult = async (market = 'SGP') => {
  // geolocation specific for those without shopping website
  logger.info('Scraper for official price reference - Longines');
  const base = 'https://www.longines.com/';
  let entry;
  const brandId = 120;
  const type = 'OFFICIAL';
  const tax = 0;
  const price = 0;
  let amount = 0;
  const sourceId = 1;
  let separator = '';
  let proxy = ''; // testing purpose
  switch (market) {
    case 'SGP':
      currencyId = 11;
      separator = '’';
      entry = 'https://www.longines.com/watches/selector'; //geolocation specific
      break;
    case 'CNY':
      // TODO different web structure
      currencyId = 20;
      separator = ',';
      entry = 'https://www.longines.cn/watches/selector';
      break;
    case 'JPN':
      currencyId = 7;
      separator = ',';
      entry = 'https://www.longines.com/watches/selector'; //geolocation specific
      // testing, limited request 100
      // proxy =
      // 'https://proxybot.io/api/v1/IJi20xeETMMQS6WTj45sbxLZ4Zo1?geolocation_code=jp&url=';
      break;
    case 'HKG':
      currencyId = 1;
      separator = ',';
      entry = 'https://www.longines.com/watches/selector'; //geolocation specific
      // testing, limited request 100
      // proxy =
      //   'https://proxybot.io/api/v1/IJi20xeETMMQS6WTj45sbxLZ4Zo1?geolocation_code=cn&url=';
      break;
    case 'USA':
    default:
      // TODO different web structure
      currencyId = 2;
      separator = ',';
      entry = 'https://shop.us.longines.com/watch-selector.html';
      break;
  }

  try {
    logger.info(entry);
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(proxy + entry);
    let data = await page.evaluate(() => document.body.innerHTML);
    let $ = cheerio.load(data);
    let results = [];
    let urls = [];

    const numWatches = parseInt(
      $('.nbr-watches span')
        .text()
        .replace(/(?:\r\n|\r|\n|\s+)/g, ' ')
        .trim()
        .split(' ')[0]
    );
    const numPages = Math.ceil(numWatches / 12);
    for (let i = 1; i <= numPages; i++) {
      let link = proxy + entry + '?page=' + i;
      logger.info(link);
      await page.goto(link);
      data = await page.evaluate(() => document.body.innerHTML);
      $ = cheerio.load(data);
      $('.watch-wrapper').each((idx, el) => {
        let reference = $(el).attr('data-reference');
        let url = base + $(el).find('a').attr('href');
        urls.push({ reference, url });
      });
    }

    for (let i = 0; i < urls.length; i++) {
      await page.goto(proxy + urls[i].url);
      data = await page.evaluate(() => document.body.innerHTML);
      $ = cheerio.load(data);
      let prc = $('.prices-price span').text();
      if (prc) {
        prc = prc.split(' ')[1].split(separator);
        amount = parseFloat(prc.join(''));
      } else {
        amount = 0;
      }
      results.push({
        sourceId,
        type,
        market,
        brandId,
        reference: urls[i].reference,
        currencyId,
        price,
        tax,
        amount,
      });
    }
    return results;
  } catch (error) {
    logger.error('Scraper for official price reference - Longines');
    logger.error(error);
    return [];
  }
};

module.exports = scrapeResult;
