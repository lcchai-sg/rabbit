const axios = require('axios');
const cheerio = require('cheerio');
const { Mappers, } = require('./utils');
const u = require('./wshop_u');

const indexing = async (context) => {
  const { client, entry, base, } = context;
  logger.debug('Watchshop indexing ...', entry);
  const baseURL = base ? base : "https://www.watchshop.com";
  const source = "watchshop";
  const lang = "en";
  const brands = [];
  const results = [];
  let payload = { source, lang, collections: ['all'], items: { 'all': [], }, }
  try {
    const { data } = await client.get(entry);
    const $ = cheerio.load(data);
    $(".main").find("a").each((idx, el) => {
      const url = baseURL + $(el).attr("href");
      const name = $(el).text();
      brands.push({ name, url });
    })
    let cnt = 0;
    for (const b of brands) {
      let next = b.url;
      do {
        console.debug(next);
        const { data } = await client.get(next);
        const $ = cheerio.load(data);
        $(".product-container").each((idx, el) => {
          const sku = $(el).find("meta[itemprop='sku']").attr("content");
          const name = $(el).find("meta[itemprop='name']").attr("content");
          const description = $(el).find("meta[itemprop='description']").attr("content").replace(/\s+/g, " ");
          const gtin13 = $(el).find("meta[itemprop='gtin13']").attr("content");
          const reference = $(el).find("meta[itemprop='mpn']").attr("content");
          const thumbnail = "https:" + $(el).find("meta[itemprop='image']").attr("content").replace("medium", "large");
          const { id: brandID, name: brand } = Mappers.generateBrandID.map(name);
          const url = baseURL + $(el).find("link[itemprop='url']").attr("href");
          const currency = $(el).find("div[itemprop='offers']").find("meta[itemprop='priceCurrency']").attr("content");
          const price = $(el).find("div[itemprop='offers']").find("meta[itemprop='price']").attr("content");
          const retail = currency + " " + price;
          payload.items['all'].push({
            source, lang, brand, brandID, url, name, description, reference, sku, gtin13,
            thumbnail, retail,
          });
          cnt++;
          if (cnt % 100 === 0) {
            results.push(payload);
            payload = { source, lang, collections: ['all'], items: { 'all': [], }, };
          }
        })
        next = $('link[rel="next"]').attr("href");
        await new Promise(r => setTimeout(r, 5000));
      } while (next);
    }
    if (payload.items['all'].length > 0) results.push(payload);
    console.debug('Watchshop indexing done.')
    return results;
  } catch (error) {
    console.error('Failed indexing for Watchshop with error : ' + error)
    return {};
  }
};

const extraction = async (context) => {
  const { client, entry, base, ...rest } = context;
  const result = { ...rest, url: entry, spec: [], related: [], };
  if (!result.source) result.source = "watchshop";
  if (!result.lang) result.lang = "en";
  const baseURL = base ? base : "https://www.watchshop.com";
  try {
    const { data } = await client.get(entry);
    const $ = cheerio.load(data);
    result.name = $('meta[property="og:title"]').attr('content');
    result.description = $('meta[property="og:description"]').attr('content');
    result.reference = $('meta[property="product:mfr_part_no"]').attr('content');
    result.gtin = $('meta[property="product:gtin"]').attr('content');
    const currency = $('meta[property="product:price:currency"]').attr('content');
    const price = $('meta[property="product:price:amount"]').attr('content');
    result.retail = currency + " " + price;
    result.price = $(".price-black").text();
    result.thumbnail = "https:" + $(".carousel-item.active").find("img").attr("src");
    const keys = []; const values = [];
    $("#product-specifications").find("th").each((idx, el) => {
      keys.push($(el).text())
    })
    $("#product-specifications").find("td").each((idx, el) => {
      values.push($(el).text())
    })
    values.forEach((value, idx) => {
      if (idx <= keys.length) result.spec.push({ key: keys[idx], value });
    })
  } catch (error) {
    console.error('Failed extraction for Watchshop with error : ' + error);
    console.error('entry : ', entry);
    if (error.response) result.code = error.response.status;
    else result.code = 'UNKNOWN ERROR';
  }
  return result;
};

(async () => {
  for (let i = 0; i < u.length; i++) {
    const ex = await extraction({
      client: axios,
      entry: u[i],
      base: "https://www.watchshop.com",
    });
    console.log(ex.url);
    ex.spec.forEach(s => console.log(s.key + " | " + s.value));
    await new Promise(r => setTimeout(r, 5000));
  }
})();
