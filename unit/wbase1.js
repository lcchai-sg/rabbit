const client = require('axios');
const cheerio = require('cheerio');

const indexing = async () => {
  const entry = "https://watchbase.com/breitling/chronomat";
  const d = (await client.get(entry)).data;
  const $ = cheerio.load(d);
  $('.item-block.watch-block .bottomtext').each((idx, el) => {
    const prod_url = $(el).attr('href');
    console.log(idx, prod_url)
    const desc = $(el).text().trim().split('\n');
    const reference = desc[0];
    let name;
    if (desc.length > 1) {
      name = desc[1].trim();
    } else {
      name = desc[0];
    }
    console.log(idx, reference, name)
  });
}

indexing();