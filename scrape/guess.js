const axios = require('axios');
const cheerio = require('cheerio');

const extraction = async (context) => {
  const { client, entry, base, ...rest } = context;
  const result = { ...rest, url: entry, spec: [], related: [], };
  try {
    //name,reference,thumbnail,price,
    const { data } = await client.get(entry);
    const $ = cheerio.load(data);
    result.name = $('meta[property="og:title"]').attr('content').split('|')[0].trim();
    result.thumbnail = $('meta[property="og:image"]').attr('content').split('|')[0].trim();
    result.gender = entry.match(/women/i) ? 'F' : 'M';
    $('script[type="application/ld+json"]').each((idx, el) => {
      const c = $(el).contents().toString();
      const j = JSON.parse(c);
      if ((j['@type']) === 'Product') {
        result.reference = j.sku;
        result.price = j.offers.priceCurrency + ' ' + j.offers.price;
      }
    })
    result.description = $('.description').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
    $('.pl-3').find('li').each((idx, el) => {
      result.spec.push($(el).text().trim())
    })
    const ref = $('.mt-3').last().text().trim();
    result.spec.push(ref);
  } catch (error) {
    console.error('Failed extraction for Diesel with error : ' + error);
    console.error('entry :', entry);
    if (error.response) result.code = error.response.status;
    else result.code = 'UNKNOWN ERROR';
  }
  return result;
};

(async () => {
  const r = [
    'https://www.guess.com/us/en/women/accessories/watches/rose-gold-tone/rose-gold-tone-diamond-analog-watch-pink/U1313L3-ROGD.html',
    'https://www.guess.com/us/en/women/accessories/watches/rose-gold-tone/sparkling-pink-analog-watch-multiplecolors/GW0032L1-MULTI.html',
  ];

  for (let i = 0; i < r.length; i++) {
    const ex = await extraction({
      client: axios,
      entry: r[i],
    })
    console.log(ex)
  }
})();