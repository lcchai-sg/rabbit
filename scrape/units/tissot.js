const axios = require('axios');
const cheerio = require('cheerio');

const scrapeResult = async (market = 'SGP') => {
  const brandId = 162;
  const type = 'OFFICIAL';
  const tax = 0;
  const price = 0;
  const sourceId = 1;

  let currencyId;
  let urls;
  let results = [];
  let symbol;

  const scrapeDefault = async () => {
    try {
      for (let url of urls) {
        let page = 1;
        do {
          const link = url + page;
          const $ = cheerio.load((await axios.get(link)).data);
          $('.products-grid a').each((idx, el) => {
            let ref = $(el).find('img').attr('src').split('/');
            let reference = ref[ref.length - 1]
              .replace('.png', '')
              .split('_')[0];
            let amount = parseFloat(
              $(el, '.product-thumbnail__price')
                .text()
                .replace(/(?:\r\n|\r|\n|\s+)/g, ' ')
                .trim()
                .split(symbol)[1]
                .replace(',', '')
            );
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
          let p = $('.pager__item .next');
          if (p.length === 0) {
            page = 1;
          } else {
            page++;
          }
        } while (page !== 1);
      }
      return results;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  const scrapeCHN = async () => {
    try {
      for (let url of urls) {
        const $ = cheerio.load((await axios.get(url)).data);
        const numWatches = parseInt($('.number-results').text().split(' ')[1]);
        const pages = Math.ceil(numWatches / 12);
        for (let i = 1; i <= pages; i++) {
          let link = url + i;
          console.log(link);
          let d = (await axios.get(link)).data;
          let $$ = cheerio.load(d);

          $$('.item').each((idx, el) => {
            let reference = $$(el).find('h5').text();
            let amount = parseFloat(
              $$(el, '.regular-price .price')
                .text()
                .replace(/(?:\r\n|\r|\n|\s+)/g, ' ')
                .trim()
                .split('￥ ')[1]
                .split(' ')[0]
                .replace(',', '')
            );
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
          await new Promise((r) => setTimeout(r, 30000));
        }
      }
      console.log('number of products: ', results.length);
      console.log(results);
      return results;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  const scrapeUSA = async () => {
    try {
      for (let url of urls) {
        const $ = cheerio.load((await axios.get(url)).data);
        const numWatches = parseInt(
          $('#watches-count')
            .text()
            .replace(/(?:\r\n|\r|\n|\s+)/g, ' ')
            .trim()
            .split(' ')[0]
        );
        const pages = Math.ceil(numWatches / 12);
        for (let i = 1; i <= pages; i++) {
          let link = url + i;
          console.log(new Date(), link);
          let d = (await axios.get(link)).data;
          let $$ = cheerio.load(d);

          $$('.product-container').each((idx, el) => {
            let reference = $$(el).attr('data-sku');
            let amount = parseFloat(
              $$(el, '.regular-price .price')
                .text()
                .replace(/(?:\r\n|\r|\n|\s+)/g, ' ')
                .trim()
                .split('$')[1]
                .split(' ')[0]
                .replace(',', '')
            );
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
          await new Promise((r) => setTimeout(r, 30000));
        }
      }
      console.log('number of products: ', results.length);
      console.log(results);
      return results;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  switch (market) {
    case 'SGP':
      urls = [
        'https://www.tissotwatches.com/zh-sg/men.html?p=',
        'https://www.tissotwatches.com/zh-sg/women.html?p=',
      ];
      currencyId = 11;
      symbol = '$';
      scrapeDefault();
      break;
    case 'HKG':
      // same as SGP
      urls = [
        'https://www.tissotwatches.com/zht-hk/men.html?p=',
        'https://www.tissotwatches.com/zht-hk/women.html?p=',
      ];
      currencyId = 1;
      symbol = '$';
      scrapeDefault();
      break;
    case 'CHN':
      // different from SGP
      urls = ['https://www.tissotwatches.cn/sale/new/all-products.html?p='];
      currencyId = 20;
      scrapeCHN();
      break;
    case 'JPN':
      // same as SGP
      urls = [
        'https://www.tissotwatches.com/ja-jp/men.html?p=',
        'https://www.tissotwatches.com/ja-jp/women.html?p=',
      ];
      currencyId = 7;
      symbol = '￥';
      scrapeDefault();
      break;
    case 'USA':
    default:
      // different from SGP
      urls = [
        'https://us.tissotshop.com/men.html?handle=default&p=',
        'https://us.tissotshop.com/women.html?handle=default&p=',
      ];
      currencyId = 2;
      symbol = '$';
      scrapeUSA();
      break;
  }
};

scrapeResult('CHN');
