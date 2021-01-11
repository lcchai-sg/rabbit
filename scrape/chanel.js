const axios = require('axios');
const cheerio = require('cheerio');

const indexing = async (context) => {
  const source = "official";
  const lang = "en";
  const brand = "Chanel";
  const brandID = 70;
  const { client, entry, base, } = context;
  const result = { source, lang, brand, brandID, collections: [], items: {} };
  const cats = [];
  const watchesPerPage = 24;
  const wurl = []
  try {
    const { data } = await client.get(entry);
    const $ = cheerio.load(data);
    $('.js-header-secondary-link   ').each((idx, el) => {
      const d = $(el).attr('data-event-action');
      if (d === 'collections') {
        const url = base + $(el).attr('href');
        const name = $(el).text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
        if (url.match(/watches/i) && !name.match(/all watches/i)) {
          cats.push({ name, url });
          result.collections.push(name);
          result.items[name] = [];
        }
      }
    });
    for (const cat of cats) {
      console.debug(cat.name, cat.url);
      let next = cat.url;
      do {
        console.log(next);
        const { data } = await client.get(next);
        const $ = cheerio.load(data);
        $('.product-grid__item.js-product-edito ').each((idx, el) => {
          const url = base + $(el).find('.txt-product a').attr('href');
          if (wurl.indexOf(url) < 0) wurl.push(url);
        });
        next = base + $('.is-loadmore').attr('href');
      } while (next !== base);
      // const { data } = await client.get(cat.url);
      // const $ = cheerio.load(data);
      // const w = parseInt($('.js-filters-total-results').text().replace(" results", ""));
      // const np = Math.ceil(w / watchesPerPage);
      // for (let i = 1; i <= np; i++) {
      //   const link = cat.url + "page=" + i + "/";
      //   console.debug(link);
      //   const { data } = await client.get(link);
      //   const $ = cheerio.load(data);
      //   $('.product-grid__item.js-product-edito ').each((idx, el) => {
      //     const url = base + $(el).find('.txt-product a').attr('href');
      //     const name = $(el).find('.heading.is-7.is-block.txt-product__title').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
      //     const thumbnail = $(el).find('.product__media img').attr('data-src');
      //     const reference = $(el).find('.is-sr-only').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").replace('Ref.', '').trim();
      //     const price = $(el).find('.is-price').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").replace('*', '').trim();
      //     result.items[cat.name].push({
      //       source, lang, brand, brandID, url, collection: cat.name,
      //       name, reference, thumbnail, price,
      //     });
      //     wurl.push(url);
      //   });
      // }
    }

    console.log()
    console.log()
    wurl.sort();
    wurl.forEach(v => console.log(v));
    console.log()
    console.log()
    console.log('length >', wurl.length)
    return result;
  } catch (error) {
    console.error('Failed indexing for Chanel with error : ' + error)
    return [];
  }
};


const extraction = async (context) => {
  const { client, entry, base, ...rest } = context;
  console.log('entry >>> ', entry)
  const result = { ...rest, url: entry, spec: [], related: [], features: [] };
  try {
    const $ = cheerio.load((await client.get(entry)).data);
    let key = $('.product-details__option').find('span').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
    let value = $('.product-details__option').find('p').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
    result.spec.push({ key, value });
    result.name = $('.heading.product-details__title ').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
    result.reference = $('.product-details__reference').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").replace('Ref.', '').trim();
    result.description = $('.product-details__description').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
    result.retail = $('.pdp-sticky__pricing .product-details__price').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").replace('*', '').trim();
    result.gender = 'F';
    result.thumbnail = $('.carousel__slide-container img').attr('data-src');
    $('.characteristics__characteristic li').each((idx, el) => {
      key = $(el).find('.heading.is-7').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
      value = $(el).find('p').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
      result.spec.push({ key, value });
    });
    return result;
  } catch (error) {
    console.log('Failed extraction for Citizen with error : ' + error);
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
    entry: "https://www.chanel.com/us/",
    brandID: 70,
    brand: "Chanel",
    base: "https://www.chanel.com",
  });
  console.log(r);
  // r.collections && r.collections.forEach(c => {
  //   r.items[c].forEach(w => {
  //     console.log(w);
  //   })
  // })

  // const rr = r ? r.items[r.collections[0]] : [];
  // const rr = [
  //   "https://www.citizenwatch.com/us/en/product/AO9003-08E.html",
  //   "https://www.citizenwatch.com/us/en/product/AO9020-84E.html",
  // ];

  // for (let i = 0; i < rr.length; i++) {
  //   const ex = await extraction({
  //     // entry: rr[i],
  //     entry: rr[i].url,
  //     client,
  //     brand: "Chanel",
  //     brandID: 70,
  //     base: "https://www.chanel.com",
  //   })
  //   console.log(ex);
  // }
})();