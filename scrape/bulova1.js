const client = require('axios');
const cheerio = require('cheerio');

const extraction = async (context) => {
  const { client, entry, ...rest } = context;
  const result = { ...rest, url: entry, spec: [], related: [], };
  try {
    const data = (await client.get(entry)).data;
    const $ = cheerio.load(data);
    result.name = $('meta[property="og:title"]').attr('content').split('|')[0].trim();
    result.thumbnail = $('meta[property="og:image"]').attr('content');
    result.description = $('.product-description').find('p').text().trim();
    const ref = entry.split('/');
    result.reference = ref[ref.length - 1] ? ref[ref.length - 1].toUpperCase() : ref[ref.length - 2].toUpperCase();
    $('meta').each((idx, el) => {
      const m = $(el).attr('property');
      if (m === 'og:price:currency') result.currency = $(el).attr('content');
      if (m === 'og:price:amount') result.price = $(el).attr('content');
    })
    const d = data.match(/{"product".*}/ig);
    const j = d ? JSON.parse(d[0]) : null;
    if (j.product.vendor && j.product.vendor !== 'Bulova - International Website')
      result.collection = j.product.vendor;
    $('.product-wrap').find('ul').each((idx, el) => {
      $(el).find('li').each((idx, el) => {
        const attr = $(el).text().trim();
        const kv = attr.split(':');
        if (kv.length === 2) {
          const key = kv[0];
          const value = kv[1];
          result.spec.push({ key, value });
        } else {
          const key = '';
          const value = kv[0];
          result.spec.push({ key, value });
        }
      })
    })
    // result.gender = Mappers.getGender.map(result.name);
    $(".product-list-item-details").each((idx, el) => {
      result.related.push($(el).find(".product-list-handle").text().trim());
    })
  } catch (error) {
    console.error('Failed extraction for Baume et Mercier with error : ' + error);
    console.error('entry :', entry);
    if (error.response) result.code = error.response.status;
    else result.code = 'UNKNOWN ERROR';
  }
  return result;
};

(async () => {
  const r = [
    "https://intl.bulova.com/collections/precisionist-watches-chronographs/products/98b315",
    // "https://intl.bulova.com/products/97l163",
    "https://intl.bulova.com/products/97a163",
    "https://intl.bulova.com/products/96p221",
    "https://intl.bulova.com/products/96p222",
    "https://intl.bulova.com/products/97a161",
    "https://intl.bulova.com/products/97a162",
    "https://intl.bulova.com/products/98a251-limited-edition-chronograph-a",
    "https://intl.bulova.com/products/98a252-chronograph-a",
    "https://intl.bulova.com/products/98a253-chronograph-a",
    "https://intl.bulova.com/products/98a254-chronograph-a",
    "https://intl.bulova.com/products/96a245-a-15-pilot",
    "https://intl.bulova.com/products/98a255-hack-watch",
    "https://intl.bulova.com/products/97l161",
    "https://intl.bulova.com/products/97p149",
    "https://intl.bulova.com/products/97a153",
    "https://intl.bulova.com/products/96b337",
    "https://intl.bulova.com/products/98b350",
    "https://intl.bulova.com/products/98c138",
    "https://intl.bulova.com/products/97c111",
    "https://intl.bulova.com/products/97a154",
    "https://intl.bulova.com/products/97a155",
    "https://intl.bulova.com/products/96a247",
    "https://intl.bulova.com/products/96l285",
    "https://intl.bulova.com/products/98l277",
    "https://intl.bulova.com/products/97p150",
    "https://intl.bulova.com/products/97p151",
    "https://intl.bulova.com/products/96b338",
    "https://intl.bulova.com/products/98d165",
    "https://intl.bulova.com/products/97d123",
    "https://intl.bulova.com/products/98a253-hack-watch"
  ];
  for (let i = 0; i < 1; i++) {
    // for (let i = 0; i < r.length; i++) {
    const ex = await extraction({
      client,
      entry: r[i],
    });
    console.log(ex);
  }
})();