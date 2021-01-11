const axios = require('axios');
const cheerio = require('cheerio');

const indexing = async (context) => {
  const source = "official";
  const lang = "en";
  const brand = "Girard-Perregaux";
  const brandID = 98;
  const { client, entry, base, } = context;
  console.log(entry);
  const result = { source, lang, brand, brandID, collections: [], items: {} };
  const cats = [];
  try {
    const $ = cheerio.load((await client.get(entry)).data);
    $('.gp-category--mega-menu-item').each((idx, el) => {
      const name = $(el).find('.title').first().text();
      const url = $(el).find('a').first().attr('href');
      if (result.collections.indexOf(name) < 0) {
        cats.push({ name, url });
        result.collections.push(name);
        result.items[name] = [];
      }
    });
    for (const cat of cats) {
      let p = 1; let cnt = 0;
      do {
        const link = cat.url + '?p=' + p;
        console.log(link);
        const { data } = await client.get(link);
        const $ = cheerio.load(data);
        cnt = 0
        $('.products-container .item').each((idx, el) => {
          const url = $(el).find('a').attr('href');
          const thumbnail = $(el).find('img').attr('src');
          const name = $(el).find('.name').text();
          const reference = $(el).find('.reference').text();
          const price = $(el).find('.price').first().text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
          result.items[cat.name].push({
            source, lang, brand, brandID, url, collection: cat.name,
            name, reference, thumbnail, price,
          });
          cnt++;
        })
        p++;
      } while (cnt >= 12)
    }
    return result;
  } catch (error) {
    console.log('Failed indexing for Girard-Perregaux with error : ' + error);
    return {};
  }
};


const extraction = async (context) => {
  const { client, entry, base, ...rest } = context;
  console.log('entry >>> ', entry)
  const result = { ...rest, url: entry, spec: [], related: [], features: [] };
  try {
    const $ = cheerio.load((await client.get(entry)).data);
    result.thumbnail = $('.main-container').first().find('.foreground').find('img').attr('src');
    result.name = $('.main-container').first().find('.product-name').text();
    result.price = $('.main-container').first().find('.price-wrapper ').text();
    result.reference = $('.main-container').first().find('.product-reference').text();
    result.description = $('.main-container').first().find('.info').text();
    $('.attribute').each((idx, el) => {
      const cat = $(el).find('.attribute-title').text();
      $(el).find('.attribute-value').each((idx, el) => {
        const key = $(el).find(".value-title").text();
        const value = $(el).find(".value-content").text();
        result.spec.push({ cat, key, value });
      })
    })
    return result;
  } catch (error) {
    console.log('Failed extraction for Girard-Perregaux with error : ' + error);
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
    entry: "https://www.girard-perregaux.com/row_en",
    brandID: 98,
    brand: "Girard Perregaux",
    base: "https://www.girard-perregaux.com",
  });
  // console.log(r);
  // let cnt = 0;
  // r.collections && r.collections.forEach(c => {
  //   r.items[c].forEach(w => {
  //     console.log(w);
  //     cnt++;
  //   })
  //   console.log('...............................................')
  // })
  // console.log('watches ... ', cnt)

  // const rr = r ? r.items[r.collections[0]] : [];
  // const rr = [
  //   "https://www.girard-perregaux.com/row_en/80498d53m7b1-bkla.html",
  //   "https://www.girard-perregaux.com/row_en/81060-21-692-fh6a.html",
  // ];

  // for (let i = 0; i < rr.length; i++) {
  //   const ex = await extraction({
  //     entry: rr[i],
  // entry: rr[i].url,
  //     client,
  //     brand: "Girard Perregaux",
  //     brandID: 98,
  //     base: "https://www.girard-perregaux.com",
  //   })
  //   console.log(ex);
  // }

  // const r = [
  //   'https://www.girard-perregaux.com/row_en/81010-11-635-11a.html',
  //   'https://www.girard-perregaux.com/row_en/99290-53-653-ba6a.html',
  //   'https://www.girard-perregaux.com/row_en/49556-52-1832bb4a.html',
  //   'https://www.girard-perregaux.com/row_en/80486d11a862-11a.html',
  // ];

  // for (let i = 0; i < r.length; i++) {
  //   const ex = await extraction({
  //     client: axios,
  //     base: "https://www.girard-perregaux.com",
  //     entry: r[i],
  //   });
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
        console.log(s.cat + ' | ' + s.key + ' | ' + s.value);
      });
      console.log()
    }
  }
})();