const axios = require('axios');
const cheerio = require('cheerio');

(async () => {
  const entry = "https://www.hamiltonwatch.com/en-us/collection.html?p=";
  let prev = "";
  let page = 1;
  let stop = false;
  do {
    const link = entry + page;
    // console.log(link)
    const $ = cheerio.load((await axios.get(link)).data);
    $(".item.product.product-item").each((idx, el) => {
      const reference = $(el).attr("data-sku");
      if (idx === 0) {
        if (prev === reference) stop = true; else prev = reference;
      }
      const url = $(el).find("a").attr("href");
      const price = $(el).find(".price-wrapper").attr("data-price-amount");
      console.log(reference, url);
    });
    page++;
  } while (!stop);
  process.exit(0)
})();