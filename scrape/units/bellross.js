const cheerio = require('cheerio');
const axios = require('axios');

const scrapeResult = async (market = 'SGP') => {
  const entry = "https://www.bellross.com/our-collections";
  const brandId = 112;
  const type = 'OFFICIAL';
  const price = 0;
  const tax = 0;
  const sourceId = 1;
  const currencyId = 11;

  try {
    let results = [];
    let res = [];
    const $ = cheerio.load((await axios.get(entry)).data);
    $('.gall_sec_rht li').each((idx, el) => {
      const url = $(el).find('a').attr('href');
      // const thumbnail = $(el).find('a img').attr('src');
      let retail = $(el).find('.price-category').text();
      retail = retail.split(" ")[1];
      // const name = $(el).find('a img').attr('alt');
      // let collection = '';
      // if (url.match(/vintage/i)) { collection = 'Vintage'; }
      // if (url.match(/instruments/i)) { collection = 'Instruments'; }
      // if (url.match(/experimental/i)) { collection = 'Experimental'; }
      if (retail) {
        res.push({
          url,
          retail,
        })  
      }
    });

    for (let i=0; i<res.length; i++) {
      const $$ = cheerio.load((await axios.get(res[i].url)).data);
      let ref = $$('.product_desc_dtls_mid p').text();
      let reference = ref.split('Ref: ')[1];
      results.push({
        sourceId,
        type,
        market,
        brandId,
        reference,
        currencyId,
        price,
        tax,
        amount: parseFloat(res[i].retail.replace(',','')),
      })
    }
    return results;
  } catch (error) {
    console.log(error);
    return [];
  }
}

module.exports = scrapeResult;