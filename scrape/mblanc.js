const axios = require('axios');
const cheerio = require('cheerio');

const indexing = async (context) => {
  const source = "official";
  const lang = "en";
  const brand = "Mont Blanc";
  const brandID = 5;
  const { client, entry, base, } = context;
  const result = { source, lang, brand, brandID, collections: [], items: {} };
  const cats = [];
  try {
    const $ = cheerio.load((await client.get(entry)).data);
    $('.yt.variant-h').each((idx, el) => {
      const name = $(el).find('.yt_b__title').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
      const url = $(el).find('a').attr('href');
      if (cats.indexOf(name) < 0) {
        cats.push({ name, url });
        result.collections.push(name);
        result.items[name] = [];
      }
    });
    $('.yt.variant-p').each((idx, el) => {
      const name = $(el).find('.yt_b__subtitle').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
      const url = $(el).find('a').attr('href');
      if (cats.indexOf(name) < 0) {
        cats.push({ name, url });
        result.collections.push(name);
        result.items[name] = [];
      }
    });
    for (const cat of cats) {
      let next = cat.url;
      do {
        console.log(next)
        const { data } = await client.get(next);
        const $ = cheerio.load(data);

        $('.item').each((idx, el) => {
          const txt = $(el).attr('data-ytos-track-product-data');
          const j = JSON.parse(txt);
          if (j.product_micro_category !== 'Straps') {
            const url = $(el).find('a').attr('href');
            const th = $(el).find('img').attr('src');
            const thumbnail = th ? th : $(el).find('img').attr('data-src');
            const name = $(el).find('.item_ml').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
            const price = $(el).find('.price').text().replace(/(?:\r\n|\r|\n|\s+)/g, "").trim();
            const reference = j.product_mfPartNumber;
            result.items[cat.name].push({
              source, lang, brand, brandID, url, collection: cat.name,
              name, reference, thumbnail, price,
            });
          }
        });

        next = $('.loadMoreProductsButton').find('a').attr('href');
      } while (next);
    }
    return result;
  }
  catch (error) {
    console.log('Failed indexing for Montblanc with error : ' + error);
    return {};
  }
};


const extraction = async (context) => {
  const { client, entry, ...rest } = context;
  console.log('Montblanc extraction...', entry)
  const result = { ...rest, url: entry, spec: [], related: [], };
  try {
    const $ = cheerio.load((await client.get(entry)).data);
    $('script[type="application/ld+json"]').each((idx, el) => {
      const d = $(el).contents();
      const j = JSON.parse(d);
      if (j && j[0] && j[0]['@type'] === 'Product') {
        result.name = j[0].name;
        result.description = j[0].description;
        result.thumbnail = j[0].image && j[0].image[0];
        result.price = j[0].offers && j[0].offers[0].priceCurrency + ' ' + j[0].offers[0].price;
        result.sku = j[0].offers[0].sku;
      }
    })
    result.reference = $('#desc-panel-content p:nth-child(2)').text().replace("Ident No. ", "");
    result.collection = $('.crumb.level_3 .text').text();
    $(".mb-product__details__panel--columns").find('p').each((idx, el) => {
      // const key = $(el).attr('class');
      const val = $(el).contents().toString().split('</strong>');
      const key = val[0].split('>')[1];
      const value = $(el).text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").replace(new RegExp(key, 'i'), '').trim();
      result.spec.push({ key, value });
    })
  } catch (error) {
    console.log('Failed extraction for Montblanc with error : ' + error);
    result.code = error.response.status;
  }
  return result;
};


(async () => {
  const r = await indexing({
    client: axios,
    // entry: "https://www.montblanc.com/en-shop/categories/watches.html",
    entry: "https://www.montblanc.com/en-us/categories/watches",
    brandID: 5,
    brand: "Montblanc",
    base: "https://www.montblanc.com",
  });
  // console.log(r);
  // r.collections.forEach(c => {
  //   r.items[c].forEach(w => {
  //     console.log(w);
  //   })
  // })

  // const rr = [
  //   'https://www.montblanc.com/en-us/wrist-watches_cod25458910981706736.html',
  //   'https://www.montblanc.com/en-us/wrist-watches_cod34480784411826082.html',
  //   'https://www.montblanc.com/en-us/wrist-watches_cod34480784411808762.html',
  //   'https://www.montblanc.com/en-us/wrist-watches_cod34480784411823398.html',
  //   'https://www.montblanc.com/en-us/smartwatches_cod34480784411791531.html',
  // ];

  // for (let i = 0; i < rr.length; i++) {
  //   const ex = await extraction({
  //     entry: rr[i],
  //     client: axios,
  //     brand: "Montblanc",
  //     brandID: 5,
  //   })
  //   console.log(ex);
  // }

  for (let i = 0; i < r.collections.length; i++) {
    const c = r.collections[i];
    for (let j = 0; j < r.items[c].length; j++) {
      const ex = await extraction({
        ...r.items[c][j],
        client: axios,
        entry: r.items[c][j]['url'],
      });
      // console.log(ex);
      console.log(ex.url)
      ex.spec.forEach(s => {
        console.log(s.key + ' | ' + s.value);
      });
      console.log()
    }
  }
})();