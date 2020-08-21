const cheerio = require('cheerio');
const axios = require('axios');

(async function () {
  try {
    const brandId = 134;
    const type = 'OFFICIAL';
    const price = 0;
    const tax = 0;
    const sourceId = 1;
    let currencyId;
    let results = [];

    let entry = 'https://nomos-glashuette.com/en/watchfinder';

    const $ = cheerio.load((await axios.get(entry)).data);
    $('.product-group.product-group--store a').each((idx, el) => {
      let name = $(el).attr('title');
      let retail = $(el)
        .find('.price--default ')
        .text()
        .replace(/(?:\r\n|\r|\n|\s+)/g, ' ')
        .trim();
      let reference = $(el)
        .find('.teaser__ref')
        .text()
        .replace(/(?:\r\n|\r|\n|\s+)/g, ' ')
        .trim();
      let ref =
        reference.split(' ').length > 1 ? reference.split(' ')[1] : reference;
      let price =
        retail.split(' ').length > 2
          ? retail.split(' ')[1]
          : retail.split(' ').length > 1
          ? retail.split(' ')[0]
          : retail;
      let currency = retail.split(' ')[retail.split(' ').length - 1];
      let result = {
        reference: ref,
        name,
        retail: {
          currency,
          price,
        },
      };

      console.log(result);
    });

    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
})();
