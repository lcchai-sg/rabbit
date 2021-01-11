const axios = require('axios');
const cheerio = require('cheerio');

const scrapeResult = async (context) => {
  // geolocation
  // https://store.snowmentech.com/shop/bellross/   chn eshop
  console.info('Scraper for official price reference - Bell Ross');
  // const { client, payload } = context;
  // let { market } = payload;
  const entry = 'https://www.bellross.com/our-collections';
  const brandId = 112;
  const type = 'OFFICIAL';
  const price = 0;
  const tax = 0;
  const sourceId = 1;
  const currencyId = 11;

  try {
    let results = [];
    let res = [];
    console.info(entry);
    const $ = cheerio.load((await axios.get(entry)).data);
    $('.gall_sec_rht li').each((idx, el) => {
      const url = $(el).find('a').attr('href');
      let retail = $(el).find('.price-category').text();
      retail = retail.split(' ')[1];
      if (retail) {
        res.push({
          url,
          retail,
        });
      }
    });

    for (let i = 0; i < res.length; i++) {
      console.info(res[i].url);
      const $$ = cheerio.load((await axios.get(res[i].url)).data);
      let ref = $$('.product_desc_dtls_mid p').text();
      let reference = ref.split('Ref: ')[1];
      results.push({
        sourceId,
        type,
        // market,
        brandId,
        reference,
        currencyId,
        price,
        tax,
        amount: parseFloat(res[i].retail.replace(',', '')),
      });
    }
    return results;
  } catch (error) {
    console.error('Scraper for official price reference - Bell Ross');
    console.error(error);
    return [];
  }
};

(async () => {
  let r = await scrapeResult();
  console.log(r)
})();