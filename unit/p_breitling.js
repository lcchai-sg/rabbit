const cheerio = require('cheerio');
const axios = require('axios');

(async () => {
  const brandID = 118;
  const brand = 'Breitling';
  const source = 'official';
  const lang = 'en';
  const base = 'https://www.breitling.com';
  const entry = 'https://www.breitling.com/sg-en/watches/all/?page=';

  try {
    const $ = cheerio.load((await axios.get(entry)).data);
    let pages = JSON.parse($('#app-pages-data').html()).total;
    for (let i=1; i<=pages; i++) {
      console.log("page = ", i)
      const link = entry + i;
      const $$ = cheerio.load((await axios.get(link)).data);
      $$('.soldier.version-soldier').each((idx, el) => {
        const url = base + $$(el).find('a').attr('href');
        const jd = JSON.parse($$(el).find('a').attr('data-gtm-event'));
        const name = jd.products[0].name;
        const reference = jd.products[0].id;
        const price = jd.products[0].price;
        const collection = jd.products[0].category;
        const thumbnail = base + $$(el).find('img').attr('src');
        console.log({
          brandID,
          brand,
          source,
          lang,
          name,
          reference,
          price,
          collection,
          url,
          thumbnail,
          productId: null,
        })
      })
    }
    process.exit(0);  
  } catch (error) {
    console.log("***** error *****");
    console.log(error);
    process.exit(1);
  }
})();
