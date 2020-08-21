const cheerio = require('cheerio');
const axios = require('axios');

const scrapeResult = async (market = 'SGP') => {
  try {
    // only USD market
    let market = 'USA';
    const brandId = 152;
    const type = 'OFFICIAL';
    const price = 0;
    const tax = 0;
    const sourceId = 1;
    let currencyId = 2;
    let urls;
  
    // const base = "https://aboutvintage.com";
    const entry = "https://aboutvintage.com/collections/all-watches";

    let results = [];
    const $ = cheerio.load((await axios.get(entry)).data);
    $('.grid-product__content').each((idx, el) => {
      //const url = base + $(el).find('.grid-product__link').attr('href');
      //const thumbnail = 'https:' + $(el).find('.image-wrap img').attr('data-src').replace('{width}', '400');
      const reference = $(el).find('.grid-product__title').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
      let retail = $(el).find('.grid-product__price').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
      let r = retail.split('$');
      let amount = (r.length === 2) ? parseFloat(r[1].replace(',','')) : parseFloat(r[0].replace(',',''));
      //const collection = name.split(',')[0];

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
        // source: 'official',
        // url,
        // thumbnail,
        // collection,
        // lang: "en",
        // name,
        // retail,
        // brand: "About Vintage",
        // brandID: 152,
        // productID: null,
        // reference,
      });
    }); //$

    return results;
  } catch (error) {
    console.log("***** error *****");
    console.log(error);
    return [];
  }
}

module.exports = scrapeResult;
