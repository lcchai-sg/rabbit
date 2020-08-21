const cheerio = require('cheerio');
const axios = require('axios');

(async () => {
  const base = "https://www.bellross.com";
  const entry = "https://www.bellross.com/our-collections";
  const source = "official";
  const brand = "bellross";
  const brandID = 112;
  const lang = "en";

  try {
    let results = [];
    const $ = cheerio.load((await axios.get(entry)).data);
    $('.gall_sec_rht li').each((idx, el) => {
      const url = $(el).find('a').attr('href');
      const thumbnail = $(el).find('a img').attr('src');
      const retail = $(el).find('.price-category').text();
      const name = $(el).find('a img').attr('alt');
      let collection = '';
      if (url.match(/vintage/i)) { collection = 'Vintage'; }
      if (url.match(/instruments/i)) { collection = 'Instruments'; }
      if (url.match(/experimental/i)) { collection = 'Experimental'; }

      if (url && name) {
        results.push({
          source,
          brand,
          brandID,
          lang,
          reference: null,
          name,
          url,
          retail,
          thumbnail,
          collection,
          productID: null,
        });
      }
    });

    console.log(results);
    console.log("*** number of products: ", results.length);
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }

})();

