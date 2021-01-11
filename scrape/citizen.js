const axios = require('axios');
const cheerio = require('cheerio');
const sitemapper = require('sitemapper');

const indexing = async (context) => {
  const source = "official";
  const lang = "en";
  const brand = "Citizen";
  const brandID = 86;
  const { client, entry, base, } = context;
  console.log(entry);
  const result = { source, lang, brand, brandID, collections: ['all'], items: { 'all': [] } };
  const cats = [];
  try {
    // const $ = cheerio.load((await client.get(entry)).data);
    // $('.wrap-sub-menu  ul:nth-child(1) li .nav-lvl-2-block li').each((idx, el) => {
    //   const href = $(el).find('a').attr('href');
    //   const name = $(el).find('a').text().trim();
    //   const url = href;
    //   if (result.collections.indexOf(name) === -1) {
    //     result.collections.push(name);
    //     result.items[name] = [];
    //     cats.push({ name, url });
    //   }
    // });
    // for (const cat of cats) {
    //   const $$ = cheerio.load((await client.get(cat.url)).data);
    //   $$('.watch').each((idx, el) => {
    //     const href = $$(el).find('a').attr('href');
    //     const reference = $$(el).find('.product-info div:nth-child(2)').text().trim();
    //     const name = $$(el).find('span.name').text().trim();
    //     const retail = $$(el).find('.product-sales-price').text().trim();
    //     const thumbnails = $$(el).find('.img  div picture img').attr('src');
    //     const collection = cat.name;
    //     const thumbnail = "http:" + thumbnails;
    //     result.items[cat.name].push({
    //       source, lang, brand, brandID, url: base + href,
    //       collection: collection, name, reference, thumbnail, price: null,
    //     });
    //   });
    // }

    const sitemap = new sitemapper({
      url: entry,
      timeout: 300000,
    });
    const d = await sitemap.fetch();
    d.sites.forEach(w => {
      if (w.match(/\/en\/product\//) && w.match(/.html/i)) {
        // product
        const url = w;
        const ref = url.split('/');
        const reference = ref[ref.length - 1].replace('.html', '');
        result.items['all'].push({
          url, reference,
        })
      }
    })
    return result;
  } catch (error) {
    console.log('Failed indexing for Citizen with error : ' + error);
    return {};
  }
};


const extraction = async (context) => {
  const { client, entry, base, ...rest } = context;
  const result = { ...rest, url: entry, spec: [], related: [], features: [] };
  try {
    const $ = cheerio.load((await client.get(entry)).data);
    const reference = entry.split("/").pop().replace(".html", "").trim();
    if (reference.indexOf('?') > -1) result.reference = reference.split('?')[0];
    result.name = $('.product-name.h1-style').text().trim();
    result.description = $('.product-col-2.product-detail.wrap-info  .description').text().trim();
    if (result.url.match(/mens/)) result.gender = "M";
    else result.gender = "F";
    result.url = result.url.match(/.*html/g)[0];
    result.thumbnail = 'https:' + $('.product-primary-image img').attr('src');
    $('.bloc-text').each((idx, el) => {
      const key = $(el).find('.small-title').text();
      const value = $(el).find(' .description').text().trim();
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
  // const client = axios.create({
  //   headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/601.3.9 (KHTML, like Gecko) Version/9.0.2 Safari/601.3.9' }
  // });
  //https://www.citizenwatch.com/sitemap_0.xml

  const r = await indexing({
    client: axios,
    entry: "https://www.citizenwatch.com/sitemap_0.xml",
    brandID: 86,
    brand: "Citizen",
    base: "https://www.citizenwatch.com",
  });
  // console.log(r);
  // r.collections && r.collections.forEach(c => {
  //   r.items[c].forEach(w => {
  //     console.log(w);
  //   })
  // })

  // const rr = r ? r.items[r.collections[0]] : [];
  // const rr = [
  //   "https://www.citizenwatch.com/us/en/product/AO9003-08E.html",
  //   "https://www.citizenwatch.com/us/en/product/AO9020-84E.html",
  //   "https://www.citizenwatch.com/us/en/product/MX0007-59X.html",
  //   "https://www.citizenwatch.com/us/en/product/JY8101-52L.html",
  //   "https://www.citizenwatch.com/us/en/product/CC5006-06L.html",
  //   "https://www.citizenwatch.com/us/en/product/CC3035-50E.html",
  //   "https://www.citizenwatch.com/us/en/product/BN0191-55L.html",
  //   "https://www.citizenwatch.com/us/en/product/JY8078-01L.html",
  //   "https://www.citizenwatch.com/us/en/product/BN2039-59E.html",
  //   "https://www.citizenwatch.com/us/en/product/AW1660-51H.html",
  //   "https://www.citizenwatch.com/us/en/product/BN7020-17E.html",
  //   "https://www.citizenwatch.com/us/en/product/CB5886-58H.html",
  //   "https://www.citizenwatch.com/us/en/product/CB5896-54X.html",
  // ];

  // for (let i = 0; i < rr.length; i++) {
  //   const ex = await extraction({
  //     entry: rr[i],
  //     //     //     // entry: rr[i].url,
  //     client: axios,
  //     brand: "Citizen",
  //     brandID: 86,
  //     base: "https://www.citizenwatch.com",
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