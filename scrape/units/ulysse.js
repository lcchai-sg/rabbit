const cheerio = require('cheerio');
const axios = require('axios');

const scrapeResult = async (market = 'SGP') => {
  try {
    const brandId = 162;
    const type = 'OFFICIAL';
    const tax = 0;
    const price = 0;
    const sourceId = 1;
  
    let currencyId;
    let entry;
    let results = [];
  
    switch(market) {
      case 'CHN':
        currencyId = 20;
        entry = 'https://www.ulysse-nardin.com/zh_zh/watches';
        break;
      case 'USA':
      default:
        currencyId = 2;
        entry = 'https://www.ulysse-nardin.com/usa_en/watches';
        break;
    }
  
    const $ = cheerio.load((await axios.get(entry)).data);
    const numWatches = parseInt($("#toolbar-number-product-count").text());
    const numPages = Math.ceil(numWatches / 9);
    for (let i=1; i<=numPages; i++) {
      let link = entry + '?p=' + i;
      let $$ = cheerio.load((await axios.get(link)).data);
  
      $$('.un-c-product__description').each((idx, el) => {
        let ref = ($$(el).find('a').attr('href')).split('/');
        reference = ref[ref.length-1].replace('.html','');
        let pos = reference.lastIndexOf('-');
        reference = (reference.substring(0, pos) + '/' + reference.substring(pos+1)).toUpperCase();

        let pr = $(el).find('span .price-wrapper').attr('data-price-amount');
        amount = (pr) ? pr : 0;
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
        })
      })
    }
    return results;
  } catch (error) {
    console.log(error)
    return [];
  }
}

module.exports = scrapeResult;