const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

const scrapeResult = async (market = 'SGP') => {
  const base = 'https://www.longines.com/';
  const entry = 'https://www.longines.com/watches/selector';
  const brandId = 120;
  const type = 'OFFICIAL';
  const tax = 0;
  const price = 0;
  const sourceId = 1;

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(entry);
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
      let link = entry + '?page=' + i;
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
      await page.goto(urls[i].url);
      data = await page.evaluate(() => document.body.innerHTML);
      $ = cheerio.load(data);
      let price = $('.prices-price span').text().split(' ');
      let currency = price[0];
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
      let amount = parseFloat(price[1].replace('’', ''));
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
    console.log(results);
    return results;
  } catch (error) {
    console.log(error);
    browser.close();
    return [];
  }
};

scrapeResult();
// module.exports = scrapeResult;
