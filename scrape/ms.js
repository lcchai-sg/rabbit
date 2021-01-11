const axios = require('axios');
const cheerio = require('cheerio');

(async () => {
  const entry = "https://meistersinger.us/shop/n01-sunburst-blue/";
  const { data } = await axios.get(entry);
  const $ = cheerio.load(data);
  const ref = $('.product_meta .sku_wrapper').first().text();
  console.log(ref);
})();
