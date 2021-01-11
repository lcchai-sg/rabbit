const axios = require('axios');
const cheerio = require('cheerio');

const indexing = async (context) => {
  const source = "official";
  const lang = "en";
  const brand = "Gaga Milano";
  const brandID = 96;
  const { client, entry, base, } = context;
  console.log(entry);
  const result = { source, lang, brand, brandID, collections: [], items: {} };
  const cats = [];
  try {
    const $ = cheerio.load((await client.get(entry)).data);
    $('.grid-col-4.wow.fadeInDown a').each((idx, el) => {
      const name = $(el).text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
      const url = $(el).attr('href');
      cats.push({ name, url });
      result.collections.push(name);
      result.items[name] = [];
    });
    for (const cat of cats) {
      const $ = cheerio.load((await client.get(cat.url)).data);
      $('.col-5.grid a').each((idx, el) => {
        const url = $(el).attr('href');
        const name = $(el).find('.info-product').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
        const thumbnail = $(el).find('.image-product img').attr('src');
        const reference = $(el).find('.ref').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
        result.items[cat.name].push({
          source, lang, brand, brandID, url, collection: cat.name,
          name, reference, thumbnail, price: null,
        });
      });
    }
    return result;
  } catch (error) {
    console.log('Failed indexing for Gaga Milano with error : ' + error);
    return {};
  }
};


const extraction = async (context) => {
  const { client, entry, base, ...rest } = context;
  console.log('entry >>> ', entry)
  const result = { ...rest, url: entry, spec: [], related: [], features: [] };
  try {
    const $ = cheerio.load((await client.get(entry)).data);
    result.name = $('.breadcrumb h1').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim() + ' ' + $('.col-md-12.border_b h3').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim() + ' ' + $('.single-product--ref .uppercase').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
    result.collection = $('.breadcrumb h1').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
    result.reference = $('.single-product--ref .uppercase').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
    result.retail = $('.regular-price').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
    result.description = $('.container .row .col-md-12.border_b .padd_txt p').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
    result.thumbnail = $('.swiper-slide img').attr('src');
    $('.list ').each((idx, el) => {
      const key = $(el).find('h4').text();
      const value = $(el).find('p').text();
      result.spec.push({ key, value });
    });
    return result;
  } catch (error) {
    console.log('Failed extraction for Gaga Milano with error : ' + error);
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
    entry: "https://gagamilano.com/collections/",
    brandID: 96,
    brand: "Gaga Milano",
    base: "https://gagamilano.com",
  });
  console.log(r);
  // r.collections && r.collections.forEach(c => {
  //   r.items[c].forEach(w => {
  //     console.log(w);
  //   })
  // })

  const rr = r ? r.items[r.collections[0]] : [];
  // const rr = [
  //   "https://gagamilano.com/product/7054ICM0107-frame_one-rose-gold-plated/",
  //   "https://gagamilano.com/product/501005S-manuale-48mm-steel/",
  // ];

  for (let i = 0; i < rr.length; i++) {
    const ex = await extraction({
      entry: rr[i],
      //     // entry: rr[i].url,
      client,
      brand: "Gaga Milano",
      brandID: 96,
      base: "https://gagamilano.com",
    })
    console.log(ex);
  }
})();