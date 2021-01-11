const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

const indexing = async (context) => {
  const source = "official";
  const lang = "en";
  const brand = "hermes";
  const brandID = 64;
  const { client, entry, base, } = context;
  const result = { source, lang, brand, brandID, collections: ['all'], items: { 'all': [] } };
  try {
    const cats = [
      //https://www.hermes.com/us/en/sitemap.xml
      {
        name: 'Men',
        // url: 'https://www.hermes.com/us/en/watches/men/#fh_view_size=72&country=us&fh_location=--%2Fcategories%3C%7Bwatchesmen%7D&fh_start_index=36|relevance|'
        url: 'https://www.hermes.com/sg/en/category/men/watches/#||Category'
      },
      {
        name: 'Women',
        // url: 'https://www.hermes.com/us/en/watches/women/#fh_view_size=36&country=us&fh_location=--%2Fcategories%3C%7Bwatcheswomen%7D&fh_start_index=324|relevance|',
        url: 'https://www.hermes.com/sg/en/category/women/watches/#fh_view_size=36&country=sg&fh_location=--%2Fcategories%3C%7Bwomenwatches%7D&fh_start_index=108||Category',
      }
    ];
    const urls = [
      "https://bck.hermes.com/products?locale=sg_en&category=WOMENWATCHES&sort=relevance",
      "https://bck.hermes.com/products?locale=sg_en&category=MENWATCHES&sort=relevance",
      "https://bck.hermes.com/products?locale=hk_en&category=WOMENWATCHES&sort=relevance",
      "https://bck.hermes.com/products?locale=hk_en&category=MENWATCHES&sort=relevance",
      "https://bck.hermes.com/products?locale=us_en&category=WOMENWATCHES&sort=relevance",
      "https://bck.hermes.com/products?locale=us_en&category=MENWATCHES&sort=relevance",
    ]
    for (const url of urls) {
      console.log(url);
      // const { data } = await client.get(url);

      const w = data.products.items;
      const currency = url.match(/hk_en/) ? 'HKD ' : url.match(/us_en/) ? 'USD ' : 'SGD ';
      const burl = 'https://www.hermes.com/' + url.match(/hk_en/) ? 'hk' : url.match(/us_en/) ? 'us' : 'sg' + '/en/';
      w.forEach(wd => {
        const reference = wd.sku;
        const name = wd.title;
        const thumbnail = 'https:' + wd.assets[0]['url'];
        const price = currency + wd.price;
        const url = burl + wd.url;
        result.items['all'].push({
          source, lang, brand, brandID, url, name, reference, thumbnail, price,
        })
      })
      await new Promise(r => setTimeout(r, 5000));
    }
    return result;
  } catch (error) {
    console.log('Failed indexing for Hermes with error : ' + error);
    return {};
  }
};


const extraction = async (context) => {
  const { client, entry, base, ...rest } = context;
  const result = { ...rest, url: entry, spec: [], related: [], features: [] };
  try {
    const { data } = await client.get(entry)
    const $ = cheerio.load(data);
    result.thumbnail = 'https:' + $('.main-product-image ').attr('src');
    result.name = $('.product-title-container p').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
    result.reference = $('.product-sku').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").replace("Product reference:", "").trim();
    result.description = $('.field-item p').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").replace('See More', '').replace('See less', '').replace('…', '').trim();

    $('.toggle-content.ng-trigger.ng-trigger-toggleContent p').text().split(/<br\s*\/?>/i)[0]
      .split('\n').map((spec, idx) =>
        result.spec.push({ key: idx++, value: spec }));
  } catch (error) {
    console.log('Failed extraction for Hermes with error : ' + error);
    result.code = error.response.status;
  }
  return result;
};


(async () => {
  const client = axios.create({
    // headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_0_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.66 Safari/537.36' }
    headers: { 'User-Agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.66 Safari/537.36" }
  });

  const r = await indexing({
    client,
    entry: "https://www.hermes.com",
    brandID: 64,
    brand: "Hermes",
    base: "https://www.hermes.com",
  });
  console.log(r);
  r.collections && r.collections.forEach(c => {
    r.items[c].forEach(w => {
      console.log(w);
    })
  })

  // const rr = r ? r.items[r.collections[0]] : [];
  // const rr = [
  //   "https://www.hermes.com/us/en/product/arceau-petite-lune-watch-38mm-W049093WW00/",
  //   "https://www.hermes.com/us/en/product/arceau-squelette-watch-40mm-W049008WW00/",
  // ];

  // for (let i = 0; i < rr.length; i++) {
  //   const ex = await extraction({
  //     entry: rr[i],
  //     // entry: rr[i].url,
  //     client: axios,
  //     brand: "Hermes",
  //     brandID: 64,
  //     base: "https://www.hermes.com",
  //   })
  //   console.log(ex);
  // }
})();