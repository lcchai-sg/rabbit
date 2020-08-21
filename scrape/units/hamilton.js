const axios = require('axios');
const cheerio = require('cheerio');

const scrapeResult = async (market = 'SGP') => {
  const brandId = 62;
  const type = 'OFFICIAL';
  const tax = 0;
  const price = 0;
  const sourceId = 1;
  let currencyId;
  let urls;
  let results = [];

  switch (market) {
    case 'SGP':
      urls = [
        'https://www.hamiltonwatch.com/en-sg/filter-by/mens-watches.html?p=',
        'https://www.hamiltonwatch.com/en-sg/filter-by/women-watches.html?p='
      ];
      currencyId = 11;
      break;
    case 'HKG':
      urls = [
        'https://www.hamiltonwatch.com/zht-hk/filter-by/mens-watches.html?p=',
        'https://www.hamiltonwatch.com/zht-hk/filter-by/women-watches.html?p=',
      ];
      currencyId = 1;
      break;
    case 'JPN':
      urls = [
        'https://www.hamiltonwatch.com/ja-jp/filter-by/men-s-watches.html?p=',
        'https://www.hamiltonwatch.com/ja-jp/filter-by/women-watches.html?p='
      ];
      currencyId = 7;
      break;
    case 'CHN':
      urls = [
        'https://www.hamiltonwatch.com/zhs-cn/filter-by/mens-watches.html?p=',
        'https://www.hamiltonwatch.com/zhs-cn/filter-by/women-watches.html?p='
      ];
      currencyId = 20;
      break;
    case 'USA':
    default:
      // website different structure, TODO
      urls = [
        'https://shop.hamiltonwatch.com/all-hamilton-watches.html?p='
      ];
      currencyId = 2;
      break;
  }

  for (let i=0; i<urls.length; i++) {
    let cp = 0; // current page
    let pl = []; // product list
    do {
      let link = urls[i] + cp;
      console.log(link)
      let d = (await axios.get(link)).data;
      const $ = cheerio.load(d);
    
      let j; // holds content of javascript
      $('script').each((idx, el) => {
        j = $(el).contents()['0'];
      })
      // convert content to json
      // format of content window.dataLayer.push({json data});
      // format to extract {json data} and parse to become json
      let jd = JSON.parse(j.data.trim().replace('window.dataLayer.push(', '').replace(');', ''));
      // get the array of the product list on the page
      pl = jd.ecommerce.impressions;
    
      pl.forEach(el => {
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
        })
      });
      cp++; // next page
    } while (pl.length === 32)  // 32 watches per page, if not equal means last page
  } // for
}

module.exports = scrapeResult;