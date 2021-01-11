const axios = require('axios');
const cheerio = require('cheerio');

const indexing = async (context) => {
  const source = "official";
  const lang = "en";
  const brand = "Casio";
  const brandID = 76;
  const { client, entry, base, } = context;
  const result = { source, lang, brand, brandID, collections: [], items: {} };
  const cats = [];
  try {
    const $ = cheerio.load((await client.get(entry)).data);
    $('.detail-list').each((idx, element) => {
      $(element).find('.grid-1').each((i, elem) => {
        $(elem).find('a').each((x, el) => {
          const catLink = $(el).attr('href');
          cats.push((base.concat(catLink)));
        })
      })
    });
    cats.shift();
    for (var watchLink of cats) {
      console.log(watchLink);
      const $ = cheerio.load((await client.get(watchLink)).data);
      if (!$) console.log('cheerio not loading...')
      $('.info.bg-white').each((idx, el) => {
        const collection = $(el).find('a').attr('href').split('/')[3].toUpperCase();
        const url = base + $(el).find('a').attr('href');
        const name = $(el).find('h5').text();
        const prtxt = $(el).text().replace(/(?:\r\n|\r|\n|\s+)/g, " ");
        const pr = prtxt.match(/\$ ?\d{0,3},?\d{2,3}.?\d{0,2}/gi);
        const price = (pr) ? pr[0] : null;
        const thumbnail = 'https:' + $(el).find('.product-figure .figure img').attr('src');
        if (result.collections.indexOf(collection) < 0) {
          result.collections.push(collection);
          result.items[collection] = [];
        }
        result.items[collection].push({
          source, lang, brand, brandID, url, collection,
          name, reference: name, thumbnail, price,
        })
      })
      // watchDetail('.contents-body').find('.model-list').each((idx, element) => {
      //   $(element).find('.column').each((x, elem) => {
      //     $(elem).find('.info').each((ind, el) => {
      //       const collection = $(el).find('a').attr('href').split('/')[3];
      //       const url = base.concat($(el).find('a').attr('href'));
      //       const name = $(el).find('a h5').text();
      //       // const price = '$ ' + $(el).find('a').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").split(' ')[5];
      //       const price = $(el).find('a ul').text();
      //       const thumbnail = 'https:'.concat($(el).find('.product-figure .figure img').attr('src'));
      //       if (result.collections.indexOf(collection) < 0) {
      //         result.collections.push(collection);
      //         result.items[collection] = [];
      //       }
      //       result.items[collection].push({
      //         source, lang, brand, brandID, url, collection,
      //         name, reference: name, thumbnail, price,
      //       })
      //     })
      //   })
      // })
    }
    return result;
  } catch (error) {
    console.log('Failed indexing for Casio with error : ' + error);
    return {};
  }
};


const extraction = async (context) => {
  const { client, entry, base, ...rest } = context;
  console.log('entry >>> ', entry)
  const result = { ...rest, url: entry, spec: [], related: [], features: [] };
  try {
    const $ = cheerio.load((await client.get(entry)).data);
    result.name = $('div.head > div.name > h2').text().trim();
    result.description = $('.feature-conts-all .js-cont-wrap > p').text().trim();
    result.retail = $('.price ').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
    result.reference = result.name;
    result.collection = entry.split('/watches/')[1].split('/')[0];
    result.thumbnail = 'https:' + $('.swiper-slide').attr('data-img-normal');
    if (result.collection === 'g-shock-s-series') result.gender = 'F';
    else result.gender = 'M';

    $(" .narrow-contents > div > article > div.js-more-list > ul.display-list li").each((idx, elem) => {
      const detail = $(elem).text();
      result.spec.push(detail);
    })
    return result;
  } catch (error) {
    console.log('Failed extraction for Casio with error : ' + error);
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
    entry: "https://www.casio.com/products/watches",
    brandID: 76,
    brand: "Casio",
    base: "https://www.casio.com",
  });
  // console.log(r);
  // r.collections && r.collections.forEach(c => {
  //   r.items[c].forEach(w => {
  //     console.log(w);
  //   })
  // })
  r.items[r.collections[0]].forEach((w, i) => (i < 5) ? console.log(w) : null);

  // const rr = r ? r.items[r.collections[0]] : [];
  // const rr = [
  //   { url: "https://www.citizenwatch.com/us/en/product/AO9003-08E.html" },
  //   { url: "https://www.citizenwatch.com/us/en/product/AO9020-84E.html" },
  // ];

  // for (let i = 0; i < (rr.length > 5 ? 5 : rr.length); i++) {
  //   const ex = await extraction({
  //     entry: rr[i].url,
  //     client,
  //     brand: "Casio",
  //     brandID: 76,
  //     base: "https://www.casio.com",
  //   })
  //   console.log(ex);
  // }
})();