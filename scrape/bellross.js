const axios = require('axios');
const cheerio = require('cheerio');
const xml2js = require('xml2js');

const indexing = async (context) => {
  const { client, entry, base, } = context;
  const source = "official";
  const lang = "en";
  const brand = "Bell & Ross";
  const brandID = 112;
  const result = { source, lang, brand, brandID, collections: [], items: {}, }
  const cats = [];
  try {
    const $ = cheerio.load((await client.get(entry)).data);
    $('.vintage_sec.comm_sel h1').each((idx, el) => {
      const name = $(el).text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
      result.collections.push(name);
      result.items[name] = [];
    });
    $('.gall_sec_rht li').each((idx, el) => {
      const url = $(el).find('a').attr('href');
      const thumbnail = $(el).find('a img').attr('src');
      const price = $(el).find('.price-category').text();
      const name = $(el).find('a img').attr('alt');
      let collection = '';
      if (url.match(/vintage/i)) collection = 'Vintage';
      if (url.match(/instruments/i)) collection = 'Instruments';
      if (url.match(/experimental/i)) collection = 'Experimental';
      if (name) {
        result.items[collection].push({
          source, lang, brand, brandID, url, collection, name,
          thumbnail, price,
        });
      }
    });
    return result;
  } catch (error) {
    console.log('Failed indexing for Bell & Ross with error ' + error);
    return {};
  }
}

const extraction = async (context) => {
  const { client, entry, base, ...rest } = context;
  const result = { ...rest, url: entry, spec: [], related: [], };
  console.log('entry >>> ', entry)
  const { data } = await client.get(entry);
  const $ = cheerio.load(data);
  result.name = $('.product-title').text().trim().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
  result.retail = $('.price_ttl').text().trim().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
  result.thumbnail = $('#main_img_thum').attr('src');
  if (entry.match(/vintage/i)) result.collection = 'Vintage';
  if (entry.match(/instruments/i)) result.collection = 'Instruments';
  if (entry.match(/experimental/i)) result.collection = 'Experimental';
  $('.tech_spec_cont p').each((idx, el) => {
    const key = $(el).text().split(':')[0];
    const value = $(el).text().split(':')[1] ? $(el).text().split(':')[1].trim() : '';
    if (key && value) result.spec.push({ key, value });
  });
  $('.product_desc_dtls_mid p').each((idx, el) => {
    result.reference = $(el).text().trim().replace(/(?:\r\n|\r|\n|\s+)/g, " ").replace('Ref:', '').trim();
  });
  result.gender = 'M';
  return result;
}


(async () => {
  const client = axios.create({
    headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/601.3.9 (KHTML, like Gecko) Version/9.0.2 Safari/601.3.9' }
  });

  const r = await indexing({
    client,
    entry: "https://www.bellross.com/our-collections",
    brandID: 112,
    brand: "Bell & Ross",
    base: "https://www.bellross.com",
  });
  // console.log(r);
  // r.collections && r.collections.forEach(c => {
  //   r.items[c].forEach(w => {
  //     console.log(w);
  //   })
  // })
  // r.items[r.collections[0]].forEach((w, i) => (i < 5) ? console.log(w) : null);

  const rr = r ? r.items[r.collections[0]] : [];
  // const rr = [
  // {
  //   url: 'https://www.bulgari.com/en-int/103144.html',
  // },
  // {
  //   url: 'https://www.bulgari.com/en-int/103148.html',
  // }
  // ];

  for (let i = 0; i < (rr.length - 1 > 5 ? 5 : rr.length - 1); i++) {
    console.log(i)
    const ex = await extraction({
      entry: rr[i].url,
      client,
      brand: "Bell & Ross",
      brandID: 112,
      base: "https://www.bellross.com",
    })
    console.log(ex);
  }
})();