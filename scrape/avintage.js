const axios = require('axios');
const cheerio = require('cheerio');
const xml2js = require('xml2js');

const indexing = async (context) => {
  const { client, entry, base, } = context;
  const source = "official";
  const lang = "en";
  const brand = "About Vintage";
  const brandID = 152;
  const result = { source, lang, brand, brandID, collections: [], items: {}, }
  const cats = [];
  try {
    const $ = cheerio.load((await client.get(entry)).data);
    $(".WatchFace__Item").each((idx, el) => {
      const name = $(el).find(".WatchFace__ItemTitle").text().replace(/\s+/g, ' ').trim();
      const url = base + $(el).attr("href");
      result.collections.push(name);
      result.items[name] = [];
      cats.push({ name, url });
    })
    for (const cat of cats) {
      let next = cat.url;
      do {
        console.log(next);
        const { data } = await client.get(cat.url);
        const $ = cheerio.load(data);
        $(".ProductItem__Wrapper").each((idx, el) => {
          const nam = $(el).find(".ProductItem__Info").text().replace(/\s+/g, ' ').replace('Swiss Made', '').trim();
          if (!nam.match(/gift set/i)) {
            const n = nam.split(' ');
            const name = n.slice(0, n.length - 2).join(' ');
            const url = base + $(el).find(".ProductItem__ImageWrapper").attr('href');
            const price = $(el).find(".ProductItem__PriceList").text();
            const thumbnail = "https:" + $(el).find(".ProductItem__Image").attr("data-src").replace("{width}", "600")
            result.items[cat.name].push({
              source, lang, brand, brandID, url, collection: cat.name,
              name, thumbnail, price,
            });
          }
        })
        next = $(".AjaxinatePagination").find("a").attr("href");
      } while (next);
    }
    return result;
  } catch (error) {
    console.error('Failed indexing for About Vintage with error ' + error);
    console.error('entry : ', entry);
    return {};
  }
}

const extraction = async (context) => {
  const { client, entry, base, ...rest } = context;
  const result = { ...rest, url: entry, spec: [], related: [], };
  try {
    const { data } = await client.get(entry);
    const $ = cheerio.load(data);
    result.name = $('meta[property="og:title"]').attr('content');
    result.thumbnail = $('meta[property="og:image"]').attr('content');
    const price = $('meta[property="product:price:amount"]').attr('content');
    const curr = $('meta[property="product:price:currency"]').attr('content');
    result.retail = curr + price;
    result.description = $('meta[property="og:description"]').attr('content');
    const ref = data.match(/"sku": "\w+"/ig);
    const refr = ref ? ref[0].split(":")[1].trim() : null;
    if (refr) {
      result.reference = refr;
      result.sku = refr;
    }
    $(".TechSpecs__Item").each((idx, el) => {
      const key = $(el).find('dt').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
      const value = $(el).find('dd').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
      result.spec.push({ key, value })
    });
  } catch (error) {
    console.error('Failed extraction for About Vintage with error : ', error);
    console.error('entry : ', entry);
    if (error.response) result.code = error.response.status;
    else result.code = 'UNKNOWN ERROR';
  }
  return result;
}


(async () => {
  const client = axios.create({
    headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/601.3.9 (KHTML, like Gecko) Version/9.0.2 Safari/601.3.9' }
  });

  const r = await indexing({
    client,
    entry: "https://aboutvintage.com/collections/",
    brandID: 152,
    brand: "About Vintage",
    base: "https://aboutvintage.com",
  });
  // console.log(r);
  // r.collections && r.collections.forEach(c => {
  //   r.items[c].forEach(w => {
  //     console.log(w);
  //   })
  // })

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