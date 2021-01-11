const axios = require('axios');
const cheerio = require('cheerio');

(async () => {
  const entry = "https://frederiqueconstant.com/pages/master-catalogue";
  const { data } = await axios.get(entry);
  const $ = cheerio.load(data);
  $('h3[data-pf-type="Heading"]').each((idx, el) => {
    const url = $(el).find("a").attr("href");
    const name = $(el).text();
    console.log('r:', name, url)
  })
  console.log('done.....')
})();