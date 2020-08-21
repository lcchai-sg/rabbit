const cheerio = require('cheerio');
const axios = require('axios');

(async () => {
  const base = "https://www.blancpain.com";
  const entry = "https://www.blancpain.com/en/collection/watchfinder";
  const source = "official";
  const brand = "blancpain";
  const brandID = 52;
  const lang = "en";
  try {
    const $ = cheerio.load((await axios.get(entry)).data);
    const amount = $('.total-results').text().replace('products', '').trim();
    const page = Math.ceil(parseInt(amount) / 24);
    let current = 0;

    do {
      const link = entry + ((current > 0) ? '?page=' + current : '');
      const $$ = cheerio.load((await axios.get(link)).data);
      $$('.col-lg-4').each((idx, el) => {
        const url = base + $$(el).find('a').attr('href');
        const thumbnail = base + $$(el).find('.watch-main-image img').attr('src');
        const name = $$(el).text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
        const collection = $$(el).find('.field.field--name-field-watch-collection.field--type-entity-reference.field--label-hidden.field--item').text().trim();
        const reference = $$(el).find('.field.field--name-field-watch-reference.field--type-string.field--label-hidden.field--item').text();
        console.log({
          source,
          brandID,
          brand,
          url,
          thumbnail,
          collection,
          lang,
          name,
          reference,
          productID: null,
          price: null,
        });
      });
      current++;
    } while (current < page)
    process.exit(0);
  } catch (error) {
    console.log("***** error *****");
    console.log(error);
    process.exit(1);
  }
})();
