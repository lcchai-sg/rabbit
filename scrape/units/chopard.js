const { Logger } = require('@cosmos/logger');
const logger = Logger.getLogger('cs:appr:scrapper', 'debug');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

const scrapeResult = async (market = 'SGP') => {
  // only usa, jpn market has price
  // chn has website but no price
  // sgp hkg no website
  try {
    logger.info('Scraper for official price reference - Chopard');
    const brandId = 44;
    const type = 'OFFICIAL';
    const tax = 0;
    const price = 0;
    const sourceId = 1;
    let currencyId;
    let results = [];
    let urls;
    let symbol;

    switch (market) {
      case 'JPN':
        urls = [
          'https://www.chopard.jp/watches/all-men-s-watches',
          'https://www.chopard.jp/watches/all-women-watches',
        ];
        currencyId = 7;
        symbol = '￥';
        break;
      case 'USA':
      default:
        urls = [
          'https://www.chopard.com/us/watches/all-men-s-watches',
          'https://www.chopard.com/us/watches/all-ladies-watches',
        ];
        currencyId = 2;
        symbol = '$';
        break;
    }

    // why work on US but not JP?
    const browser = await puppeteer.launch();
    for (let link of urls) {
      logger.info(link);
      let page = await browser.newPage();
      await page.goto(link);
      await page.click('.moreless-products.mf-listen');
      const data = await page.evaluate(() => document.body.innerHTML);
      const $ = cheerio.load(data);
      $('.border-container').each((idx, el) => {
        let url = $(el).find('a').attr('href');
        let ref, reference, prc;
        if (url) {
          ref = url.split('-');
          reference = ref[ref.length - 2] + '-' + ref[ref.length - 1];
          prc = $(el, '.price').text();
          if (prc.indexOf(symbol) > -1) {
            amount = parseFloat(
              prc.split(symbol)[1].replace('SHOPSHOP', '').replace(',', '')
            );
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
        }
      });
    }
    browser.close();
    return results;
  } catch (error) {
    logger.error('Scraper for official price reference - Chopard');
    logger.error(error);
    browser.close();
    return [];
  }
};

scrapeResult('JPN');
