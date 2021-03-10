const axios = require('axios');
const cheerio = require('cheerio');
const { curly } = require('node-libcurl');

const indexing = async (context) => {
  const source = "official";
  const lang = "en";
  const brand = "Mido";
  const brandID = 172;
  const { client, entry, base } = context;
  const baseURL = base ? base : "https://www.midowatches.com/us";
  const result = { source, lang, brand, brandID, collections: [], items: {} };
  const cfg = { headers: { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 11_2_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.182 Safari/537.36" } };

  try {
    const cats = {};
    console.debug(entry);
    const { data } = await client.get(entry, cfg);
    // const { statusCode, data, } = await curly.get(entry);
    // if (statusCode === 200) {
    const $ = cheerio.load(data);
    $('.main-menu__submenu-item').each((idx, el) => {
      const url = $(el).find('a').attr('href');
      if (url && url.match(/watches\/collections/i)) {
        const u = url.split('/');
        const key = u[u.length - 1].replace('.html', '');
        const collection = $(el).find('a').text().trim();
        cats[key] = collection;
        // result.collections.push(collection);
        // result.items[collection] = [];
      }
    })
    let page = 1; let cnt = 0;
    do {
      cnt = 0;
      const link = entry + "?p=" + page;
      console.debug(link)
      const { data } = await client.get(link, cfg);
      // const { statusCode, data, } = await curly.get(link);
      // if (statusCode === 200) {
      const $ = cheerio.load(data);
      $(".product-thumbnail.product-item-link").each((idx, el) => {
        const url = $(el).attr("href");
        const thumbnail = $(el).find("img").attr("data-src");
        const name = $(el).find(".product-thumbnail__description").text().replace(/\s+/g, "  ").trim();
        const r = thumbnail.split('/');
        const reference = r[r.length - 1].split('_')[0];
        const retail = $(el).find(".price-box.price-final_price").text().trim();
        let collection = "unknown";
        Object.keys(cats).forEach(key => {
          const col = new RegExp(key, 'i');
          if (url.match(col) || name.match(col)) collection = cats[key];
        })
        if (result.collections.indexOf(collection) < 0) {
          result.collections.push(collection);
          result.items[collection] = [];
        }
        result.items[collection].push({
          source, lang, brand, brandID, url, collection,
          name, reference, retail, thumbnail,
        });
        if (idx === 0) console.log(url, collection, name, reference, retail);
        cnt++;
      })
      page++;
      await new Promise(r => setTimeout(r, 3000));
      // } else {
      //   console.log('Failed indexing for entry : ', link);
      //   cnt = 99;
      // }
    } while (cnt >= 32);
    return result;
    // } else {
    //   Logger.error('Failed indexing for Mido with error code : ', statusCode);
    //   return {};
    // }
  } catch (error) {
    console.error('Failed indexing for Mido with error : ' + error);
    console.error('entry : ', entry)
    return {};
  }
};

const extraction = async (context) => {
  const { client, entry, base, ...rest } = context;
  const baseURL = base ? base : "https://www.midowatches.com";
  const result = { ...rest, url: entry, spec: [], };
  try {
    // const { statusCode, data, } = await curly.get(entry);
    // if (statusCode === 200) {
    const { data } = await client.get(entry);
    const $ = cheerio.load(data);
    result.thumbnail = $(".product-mosaic__img-container").first().find("img").attr("src");
    result.name = $(".product-name").text().replace(/\s+/g, " ").trim();
    result.reference = $(".product-sku").first().text().replace(/\s+/g, ' ').trim();
    result.retail = $(".price-box.price-final_price").text().replace(/\s+/g, " ").trim();
    result.description = $('p[itemprop="description"]').text();
    $(".content-system--html").first().find("li").each((idx, el) => {
      const key = "summary";
      const value = $(el).text().replace(/\s+/g, ' ').trim();
      result.spec.push({ key, value });
    })
    $(".tab__content").each((idx, el) => {
      const cat = $(el).attr('aria-labelledby');
      $(el).find("li").each((idx, el) => {
        const key = $(el).find("h4").text();
        const value = $(el).find("p").text();
        result.spec.push({ cat, key, value });
      })
    })
    // }
  } catch (error) {
    console.error('Failed extraction for Mido with error : ' + error);
    console.error('entry : ', entry);
    if (error.response) result.code = error.response.status;
    else result.code = 'UNKNOWN ERROR';
  }
  return result;
};

(async () => {
  // const r = await xml({
  //   client: axios,
  //   entry: "https://www.midowatches.com/us/sitemap.xml",
  //   base: "https://www.midowatches.com",
  // });
  // r.collections.forEach(c => {
  //   console.log(c);
  //   r.items[c].forEach(w => console.log(w));
  // })

  const r = await indexing({
    client: axios,
    // entry: "https://www.midowatches.com/us/collections.html",
    entry: "https://www.midowatches.com/us/watches.html",
    base: "https://www.midowatches.com",
  })
  r.collections.forEach(c => {
    r.items[c].forEach(w => console.log(w));
  })
  // const r = [
  //   'https://www.midowatches.com/us/baroncelli-tonneau-lady-m0413073629600.html',
  //   'https://www.midowatches.com/us/baroncelli-moon-phase-m86074m142.html',
  //   'https://www.midowatches.com/us/multifort-patrimony-m0404071606000.html',
  // ];

  // for (let i = 0; i < r.length; i++) {
  //   const ex = await extraction({
  //     client: axios,
  //     entry: r[i],
  //     base: "https://www.midowatches.com",
  //   });
  //   console.log(ex);
  //   await new Promise(r => setTimeout(r, 5000))
  // }
})();