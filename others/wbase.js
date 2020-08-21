const axios = require('axios');
const cheerio = require('cheerio');

(async () => {
  const entry = "https://watchbase.com/watches";
  const d = (await axios.get(entry)).data;
  const $ = cheerio.load(d);
  const brands = [];
  $('.brand-box').each((_, el) => {
    let name = $(el).find('img').attr('alt');
    const url = $(el).find('a').attr('href');
    if (url) {
      if (!name) {
        const n = url.split('/');
        name = n[n.length - 1];
      }
      brands.push({ name, url });
    }
  });

  for (const brand of brands) {
    console.log(brand.url)
    const d = (await axios.get(brand.url)).data;
    const $ = cheerio.load(d);
    const weburl = $('#brandurl').attr('href');
    if (weburl) brand.weburl = weburl;
  }

  brands.forEach(brand => console.log(brand));
})();