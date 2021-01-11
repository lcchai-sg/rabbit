const axios = require('axios');
const cheerio = require('cheerio');
const fetchUrl = require('fetch').fetchUrl;

const indexing = async (context) => {
  const { client, entry, base, } = context;
  console.log(entry);
  const result = { collections: [], items: {} };
  const collections = [];
  try {
    const { data } = await client.get(entry);
    const $ = cheerio.load(data);

    $('.four-collections a.four-collections__link')
      .each((idx, element) => {
        collections.push(base + $(element).attr('href'));
      });
    const urls = [];
    for (const url of collections) {
      console.log(url);
      const { data } = await client.get(url);
      const $ = cheerio.load(data);
      let collection = $('main h1').text();
      collection = collection.substr(0, collection.indexOf(" "));
      if (result.collections.indexOf(collection)) {
        result.collections.push(collection);
        result.items[collection] = [];
      }
      $('section.product-list .product-list__item').each((idx, el) => {
        const $$ = cheerio.load(el);
        const href = $$('a').attr('href');
        const reference = $$('.product-list__ref').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
        const n = $$('a h3').text();

        if (urls.indexOf(href) === -1) {
          urls.push(href);
          let url;
          let name = n.startsWith(collection) ? n.substr(collection.length + 1).trim() : n;
          if (href.indexOf('?') > -1) {
            url = href.substring(0, href.indexOf('?'));
          } else {
            url = href;
          }
          if (!url.startsWith('http') && base) {
            url = base + url.substr(1);
          }
          result.items[collection].push({
            url,
            reference,
            collection,
            name
          })
        }
      })
    }
    return result;
  } catch (error) {
    console.log('Failed indexing for Glashutte Original with error : ' + error);
    return {};
  }
};


const extraction = async (context) => {
  const { client, entry, base, ...rest } = context;
  console.log('entry >>> ', entry)
  const result = { ...rest, url: entry, spec: [], related: [], features: [] };
  try {
    const $ = cheerio.load((await client.get(entry)).data);
    const collection = $('main .slider-main__inner .slider-main__item__subtitle:first-of-type').text().trim();
    result.collection = collection.substr(0, collection.indexOf(' '));
    result.name = $('main .slider-main__inner h2').text().trim();
    result.thumbnail = base + ($('section.product[itemscope] .product__img a.product__link img').attr('data-src')).substr(1);
    $('section.product[itemscope] .product__info .product__info__item').each((idx, ele) => {
      let key = $(ele).find('h3').text().trim();
      let value = $(ele).find('.product__info__text > span').text().trim();
      result.spec.push({ key, value });
      if (key === 'Reference Number') {
        result.reference = value;
      }
    });
    $('section.product.product--calibre .product__info__item').each((idx, ele) => {
      result.spec.push({
        group: 'calibre',
        key: $(ele).find('h3').text().trim(),
        value: $(ele).find('.product__info__text').text().trim()
      })
    });
    return result;
  } catch (error) {
    console.log('Failed extraction for Glashutte Original with error : ' + error);
    result.code = error.response.status;
  }
  return result;
};


(async () => {
  const client = axios.create({
    headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/601.3.9 (KHTML, like Gecko) Version/9.0.2 Safari/601.3.9' }
  });

  const r = await indexing({
    client,
    entry: "https://www.glashuette-original.com/",
    // entry: "https://www.glashuette-original.com/collection",
    brandID: 168,
    brand: "Glashutte Original",
    base: "https://www.glashuette-original.com/",
  });
  // console.log(r);
  // r.collections && r.collections.forEach(c => {
  //   r.items[c].forEach(w => {
  //     console.log(w);
  //   })
  // })

  const rr = r ? r.items[r.collections[0]] : [];
  // const rr = [
  //   "https://www.glashuette-original.com/collection/senator/senator-chronometer/1-58-01-02-05-01",
  //   "https://www.glashuette-original.com/collection/senator/senator-manual-winding-skeletonized-edition/1-49-18-01-05-30",
  // ];

  for (let i = 0; i < rr.length; i++) {
    const ex = await extraction({
      // entry: rr[i],
      entry: rr[i].url,
      client,
      brand: "Glashutte Original",
      brandID: 168,
      base: "https://www.glashuette-original.com/",
    })
    console.log(ex);
  }
})();