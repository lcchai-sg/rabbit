const axios = require('axios');
const cheerio = require('cheerio');

const indexing = async (context) => {
  const { client, entry, base, } = context;
  const source = "official";
  const lang = "en";
  const brand = "Parmigiani";
  const brandID = 158;
  const result = { source, lang, brand, brandID, collections: [], items: {} };
  const cats = [];
  try {
    const { data } = await client.get(entry)
    const $ = cheerio.load(data);
    $('.product-wrap').find(".col").each((idx, el) => {
      const href = $(el).find(".route-name").attr("href");
      const name = $(el).find(".product-title").text();
      if (name) {
        const url = base + href;
        cats.push({ name, url });
      }
    })
    for (const cat of cats) {
      console.log(cat.url);
      const { data } = await client.get(cat.url);
      const $ = cheerio.load(data);
      result.collections.push(cat.name);
      result.items[cat.name] = [];
      $('.item-collection').each((idx, el) => {
        const url = base + $(el).find(".item-image").find("a").attr("href");
        const thumbnail = $(el).find(".item-image").find("img").attr("src");
        const name = cat.name + ' ' + $(el).find(".item-image").find("img").attr("alt");
        const ref = url.split('/');
        const reference = ref[ref.length - 1].toUpperCase();
        result.items[cat.name].push({
          source, lang, brand, brandID, url, collection: cat.name,
          name, reference, thumbnail, price: null,
        })
      })
    }
    return result;
  } catch (error) {
    console.log('Failed indexing for Parmigiani with error : ' + error)
    return {};
  }
}

const extraction = async (context) => {
  const { client, entry, base, ...rest } = context
  const result = { ...rest, url: entry, spec: [], related: [], };
  try {
    const { data } = await client.get(entry);
    const $ = cheerio.load(data);
    result.collection = $('.col-md-3 h1').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").split(' ')[0].trim();
    result.reference = entry.split('/').pop().toUpperCase();
    result.name = $('.text-primary.watch-detail-h1-span').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim() + ' ' + result.reference;
    result.retail = $('.detail-price').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").replace('Info', '').trim();
    result.description = $('.col-12.col-md-8.lead.mb-3.mb-md-5.text-justify ').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
    result.gender = 'M';
    const keys = []
    const values = []
    $('.container.container-btm .col-md-4').each((idxC, elC) => {
      $(elC).find('h3').each((idxH, elmH) => {
        const cat = $(elmH).text().trim();
        if (cat) {
          if (cat !== 'Functions') {
            // console.log('idxC :', idxC, 'idxH: ', idxH)
            $(elC).find('dl').each((idxK, elK) => {
              if (idxK === idxH || cat === 'Dial') {
                $(elK).find('dt').each((idxK, elK) => {
                  const key = $(elK).text().trim();
                  keys.push({ cat, key });
                  // console.log(cat, key)
                })
              }
            })
            $(elC).find('dl').each((idxK, elK) => {
              if (idxK === idxH || cat === 'Dial') {
                $(elK).find('dd').each((idxK, elK) => {
                  const value = $(elK).text().trim();
                  values.push(value);
                  // console.log(cat, value)
                })
              }
            })
          } else {
            // special treatment for functions since no dt/dd
            // console.log('idxC :', idxC, 'idxH: ', idxH)
            const value = $(elC).find('p').text().trim();
            keys.push({ cat, key: "functions" });
            values.push(value);
            // console.log(cat, value);
          }
        }
      })
    })
    values.forEach((value, i) => {
      result.spec.push({ cat: keys[i].cat, key: keys[i].key, value });
    })
  } catch (error) {
    console.error('Failed extraction for Parmigiani with error : ' + error);
    console.error('url:', entry);
    return { error: error.response.status }
  }
  return result;
};

(async () => {
  // const r = await indexing({
  //   client: axios,
  //   entry: "https://www.parmigiani.com/en/",
  //   base: "https://www.parmigiani.com",
  // });
  // console.log(r);
  // r.collections.forEach(c => {
  //   console.log(c, '.....', r.items[c].length)
  //   r.items[c].forEach(w => console.log(w));
  // })

  const r = [
    {
      source: 'official',
      lang: 'en',
      brand: 'Parmigiani',
      brandID: 158,
      url: 'https://www.parmigiani.com/en/watch/kalpa/kalpagraphe/pfc128-1003200-x01441',
      collection: 'KALPA',
      name: 'KALPA KALPAGRAPHE',
      reference: 'PFC128-1003200-X01441',
      thumbnail: 'https://www.parmigiani.com/media/cache/thumblist/uploads/watch/mobile/pfc128-1003200-x01441.png',
      price: null
    },
    {
      source: 'official',
      lang: 'en',
      brand: 'Parmigiani',
      brandID: 158,
      url: 'https://www.parmigiani.com/en/watch/kalpa/kalpagraphe/PFC128-0001400-B00102',
      collection: 'KALPA',
      name: 'KALPA KALPAGRAPHE',
      reference: 'PFC128-0001400-B00102',
      thumbnail: 'https://www.parmigiani.com/media/cache/thumblist/uploads/watch/mobile/PFC128-0001400-B00102.png',
      price: null
    },
    {
      source: 'official',
      lang: 'en',
      brand: 'Parmigiani',
      brandID: 158,
      url: 'https://www.parmigiani.com/en/watch/kalpa/kalpagraphe/PFC128-0000100-B00102',
      collection: 'KALPA',
      name: 'KALPA KALPAGRAPHE',
      reference: 'PFC128-0000100-B00102',
      thumbnail: 'https://www.parmigiani.com/media/cache/thumblist/uploads/watch/mobile/PFC128-0000100-B00102.png',
      price: null
    }
  ]

  for (let i = 0; i < r.length; i++) {
    const ex = await extraction({
      client: axios,
      entry: r[i].url,
      ...r[i],
    });
    console.log(ex);
  }
})();