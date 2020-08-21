const axios = require('axios');
const cheerio = require('cheerio');

const indexing = async () => {
  const entry = 'https://watchbase.com/watches';
  const data = (await axios.get(entry)).data;
  const $ = cheerio.load(data);
  const urls = [];

  $('.brand-box').each((idx, el) => {
    const brand = $(el).find('img').attr('alt');
    $(el).find('a').each((idx1, el1) => {
      const collection = $(el1).text().trim();
      const url = $(el1).attr('href');
      if (collection && collection !== 'Brand')
        urls.push({
          source: 'watchbase',
          lang: 'en',
          brand,
          collection,
          collection_url: url
        });
    })
  });

  const results = [];
  for (const url of urls) {
    console.log(url.collection_url)
    const data = (await axios.get(url.collection_url)).data;
    const $ = cheerio.load(data);
    $('.item-block.watch-block .bottomtext').each((idx, el) => {
      const prod_url = $(el).attr('href');
      const desc = $(el).text().trim().split('\n');
      const reference = desc[0];
      const name = desc[1].trim();
      results.push({
        ...url,
        prod_url,
        name,
        reference
      })
    });

    results.forEach(val => console.log(val))

    process.exit(0)
  }
}

indexing();