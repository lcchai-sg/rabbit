const axios = require('axios');
const cheerio = require('cheerio');

const indexing = async (context) => {
  const { client, entry, base, } = context;
  const source = "official";
  const lang = "en";
  const brand = "Cartier";
  const brandID = 28;
  const urls = [
    "https://www.cartier.com/en-us/collections/watches/women-s-watch.productlistingservletv2.json",
    "https://www.cartier.com/en-us/collections/watches/mens-watches.productlistingservletv2.json",
  ];
  const result = { source, lang, brand, brandID, collections: [], items: {}, }
  try {
    for (const url of urls) {
      console.log(url);
      const { data } = await client.get(url);
      const watches = data.listing.all;
      watches.forEach(w => {
        const collection = w.productCollectionEN;
        if (result.collections.indexOf(collection) < 0) {
          result.collections.push(collection);
          result.items[collection] = [];
        }
        result.items[collection].push({
          source, lang, brand, brandID, url: base + w.pdpURL, collection,
          name: w.productNameEN, reference: w.reference, price: w.priceFormatted,
          thumbnail: base + w.image, gender: w.filter.Gender,
        })
      })
    }
    return result;
  } catch (error) {
    console.log('Failed indexing for Cartier with error ' + error);
    return {};
  }
}

const extraction = async (context) => {
  const { client, entry, base, ...rest } = context;
  const result = { ...rest, url: entry, spec: [], related: [], };
  const { data } = await client.get(entry);
  const $ = cheerio.load(data);
  result.description = $('div.tabbed-content__content-column > p.paragraph').text().trim();
  result.thumbnail = base + $('.c-image-adaptive').attr('data-original-url');
  result.collection = $('.c-breadcrumb__list li:nth-child(4)').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
  result.name = $('.top-heading').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
  result.reference = $('.small-text.js-pdp__cta-section--product-ref-id').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim().split(":")[1];
  $('.tabbed-content__content-column').each((idx, el) => {
    const key = $(el).find('h3').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
    const value = $(el).find('p').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
    if (key) result.spec.push({ key, value });
  });
  return result;
}


(async () => {
  const client = axios.create({
    headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/601.3.9 (KHTML, like Gecko) Version/9.0.2 Safari/601.3.9' }
  });
  //https://www.en.cartier.com/sitemap.xml

  const r = await indexing({
    client,
    entry: "https://www.en.cartier.com/collections/watches/",
    brandID: 28,
    brand: "Cartier",
    base: "https://www.cartier.com",
  });
  // console.log(r);
  // r.collections && r.collections.forEach(c => {
  //   r.items[c].forEach(w => {
  //     console.log(w);
  //   })
  // })
  // r.items[r.collections[0]].forEach((w, i) => (i < 5) ? console.log(w) : null);

  // const rr = r ? r.items[r.collections[0]] : [];
  // const rr = [
  //   { url: "https://www.en.cartier.com/collections/watches/women-s-watches/tank/tank-louis-cartier/wt200006-tank-louis-cartier-watch.html" },
  //   { url: "https://www.en.cartier.com/collections/watches/women-s-watches/tank/tank-am%C3%A9ricaine/wsta0016-tank-am%C3%A9ricaine-watch.html" },
  // ];

  // for (let i = 0; i < (rr.length - 1 > 5 ? 5 : rr.length - 1); i++) {
  //   console.log(i)
  //   const ex = await extraction({
  //     entry: rr[i].url,
  //     client,
  //     brand: "Cartier",
  //     brandID: 28,
  //     base: "https://www.cartier.com",
  //   })
  //   console.log(ex);
  // }

  for (let i = 0; i < r.collections.length; i++) {
    const c = r.collections[i];
    for (let j = 0; j < r.items[c].length; j++) {
      const ex = await extraction({
        entry: r.items[c][j].url,
        client: axios,
        ...r.items[c][j],
      });
      ex.spec.forEach(s => console.log(s.key + " | " + s.value));
    }
  }
})();