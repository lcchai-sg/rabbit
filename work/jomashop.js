const axios = require('axios');
const cheerio = require('cheerio');

(async () => {
  const st = 1;
  const end = 100;
  const entry = "https://www.jomashop.com/watches.html?p=";
  const result = [];
  for (let i = st; i <= end; i++) {
    const link = entry + i;
    console.log(link);
    const d = (await axios.get(link)).data;
    const $ = cheerio.load(d);
    $('.products-grid li').each((idx, el) => {
      const url = $(el).find('a').attr('href');
      const name = $(el).find('a img').attr('alt');
      const brand = $(el).find('.manufacturer').text();
      let thumbnail = '';
      if ($(el).find('a img').attr('data-original')) {
        thumbnail = $(el).find('a img').attr('data-original');
      } else {
        thumbnail = $(el).find('a img').attr('src');
      }
      let retail = '';
      if ($(el).find('.special-price').text()) {
        retail = $(el).find('.special-price').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
      } else {
        retail = $(el).find('.regular-price').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
      }
      let reference = '';
      const words = url.split('-');
      for (const word of words) {
        if (word.match(/html/i)) {
          reference = word.replace('.html', '').trim();
        }
      }
      result.push({
        url,
        source: 'jomashop',
        name,
        retail,
        thumbnail,
        brand,
        reference,
        lang: "en",
      });
    });
    await new Promise(r => setTimeout(r, 5000));
  }
  result.forEach(v => console.log(v))
})();