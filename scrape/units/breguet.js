const axios = require('axios');
const cheerio = require('cheerio');

const scrapeResult = async (market = 'SGP') => {
  const base = "https://www.breguet.com/";
  const entry = "https://www.breguet.com/en/watch-finder";
  const brandId = 132;
  const type = 'OFFICIAL';
  const price = 0;
  const tax = 0;
  const sourceId = 1;
  const currencyId = 11;
  let results = [];

  try {
    let $ = cheerio.load((await axios.get(entry)).data);
    let total = $('.result-count').text();
    const pages = Math.floor(parseInt(total) / 12);
    let urls = [];
    for (let i=0; i<=pages; i++) {
      let link = entry + '?page=' + i;
      let $ = cheerio.load((await axios.get(link)).data);
      $('.watches a').each((idx, el) => {
        urls.push(base + $(el).attr('href'));
      });
    }
    for (let i=0; i<urls.length; i++) {
      if (urls[i].indexOf('é') > 0) {
        urls[i] = urls[i].replace('é','e');
      }
      let $ = cheerio.load((await axios.get(urls[i])).data);
      let reference = $('.show-price-button').attr('data-ref');
      if (!reference) {
        continue;
      }
      let ajaxData = 'https://www.breguet.com/en/ajax/price/' + reference;
      let retail = (await axios.get(ajaxData)).data.replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
      if (retail.indexOf('Please contact') > 0) {
        amount = 0;
      } else {
        retail = retail.replace('SGD ','').replace('*<br>* Recommended retail price (incl. VAT)','').trim().replace(' ','');
        amount = parseFloat(retail);
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
    return results;      
  } catch (error) {
    console.log("***** error *****");
    console.log(error);
    return [];
  }
}

module.exports = scrapeResult;
