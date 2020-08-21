const cheerio = require('cheerio');
const axios = require('axios');

(async function () {
  try {
    let base = "https://nomos-glashuette.com";
    let entry = "https://nomos-glashuette.com/en/watchfinder";

    const $ = cheerio.load((await axios.get(entry)).data);
    let cnt = 0;
    let results = [];
    $('.product-group.product-group--store a').each((idx, el) => {
      let collection = $(el).attr('data-category');
      let url = base + $(el).attr('href');
      let name = $(el).attr('title');
      let thumbnail = $(el).find('.media-box-wrapper img').attr('data-src');
      let retail = $(el).find('.price--default ').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
      let reference = $(el).find('.teaser__ref').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
      let ref = (reference.split(" ").length > 1) ? reference.split(" ")[1] : reference;
      let price = (retail.split(" ").length > 2) ? 
        retail.split(" ")[1] : (retail.split(" ").length > 1) ? retail.split(" ")[0] : retail;
      let currency = retail.split(" ")[retail.split(" ").length-1];
      let result = {
        source: "official",
        brandID: 134,
        brand: "Nomos Glashütte",
        lang: "en",
        collection,
        reference: ref,
        name,
        retail : {
          currency,
          price,
        },
        url,
        thumbnail,
        productID: null,
      };

      console.log(result)
      results.push(result);

      cnt++;
    })

    console.log("number of products: ", cnt);
    results.forEach(el => {
      console.log(el)
    });
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
})();
