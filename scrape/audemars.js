const axios = require('axios');
const cheerio = require('cheerio');
const sitemapper = require('sitemapper');

const indexing = async context => {
  const { client, entry, base, } = context;
  const source = "official";
  const lang = "en";
  const brand = "Audemars Piguet";
  const brandID = 18;
  const result = { source, lang, brand, brandID, collections: [], items: {}, }
  try {
    const sitemap = new sitemapper({
      url: entry,
      timeout: 300000,
    });
    const d = await sitemap.fetch();
    d.sites.forEach(url => {
      const w = url.split('/');
      const collection = w[5].toUpperCase().split('-').join(' ');
      if (result.collections.indexOf(collection) < 0) {
        result.collections.push(collection);
        result.items[collection] = [];
      }
      result.items[collection].push({
        source, lang, brand, brandID, url,
        collection,
        name: collection + w[6].toUpperCase(),
        thumbnail: null,
        reference: w[6],
        price: null,
      })
    })

    return result;
  } catch (error) {
    console.log('Failed indexing for Audemars Piguet with error ' + error);
    return {};
  }
}

const extraction = async (context) => {
  const { client, entry, base, ...rest } = context;
  const result = { ...rest, url: entry, spec: [], related: [], };
  try {
    const { data } = await client.get(entry);
    const $ = cheerio.load(data);
    console.debug(entry)
    result.reference = $('meta[name="watch-reference"]').attr('content').toUpperCase();
    const jsonData = 'https://www.audemarspiguet.com/api/v1/watchprice/?lang=en&reference=' + result.reference;
    const json = (await client.get(jsonData)).data;
    result.thumbnail = base + $('.odo-responsive-img').find('source').first().attr('srcset').split(',')[0].split(' ')[0];
    result.price = json['data'][7]['price']['formatted_price'].replace('&#36;', '$');
    result.name = $('.watch-detail-header__title').text().trim();
    result.collection = entry.split('/watch-collection/')[1].split('/')[0].toUpperCase();
    result.description = $('.watch-detail-header__description-container .type-body-2').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
    if (result.description.indexOf('woman') > -1) result.gender = 'F';
    else result.gender = 'M';
    {
      const key = $(".case-feature-specs__main").find("h2").text();
      const value = $(".case-feature-specs__main").find("p").text();
      if (key || value) result.spec.push({ key, value });
    }
    $(".case-feature-specs__stats").find(".stat__content-wrap").each((idx, el) => {
      const key = $(el).find(".stat__name-container").text();
      const value = $(el).find(".stat__units-container").text();
      if (key || value) result.spec.push({ key, value });
    })
    $(".case-feature-specs__secondary").find(".case-feature-specs__content-item").each((idx, el) => {
      const key = $(el).find("h5").text();
      const value = $(el).find("p").text();
      if (key || value) result.spec.push({ key, value });
    })
    $(".case-feature-specs__secondary").find(".case-feature-specs__content-item").each((idx, el) => {
      const key = $(el).find("h2").text();
      const value = $(el).find("p").text();
      if (key || value) result.spec.push({ key, value });
    })
    {
      const key = $(".watch-mechanisms__mechanisms-container").find("h2").text();
      const value = $(".watch-mechanisms__mechanisms-container").find("p").text();
      if (key || value) result.spec.push({ key, value });
    }
    {
      const key = 'movement';
      const value = $(".watch-mechanisms__stats").find(".stat__name-container").text();
      if (value) result.spec.push({ key, value });
    }
    $('script').each((idx, el) => {
      const d = $(el).contents().toString();
      if (d.match(/window.code1159\[\'watch-details\'\]/i)) {
        const dd = d.split('\n');
        dd.forEach(d => {
          if (d.match(/window.code1159\[\'watch-details\'\]/i) && d.match(/"calibre"/i)) {
            const dd = d.replace("window.code1159['watch-details'] = ", "");
            const c = dd.match(/"calibre":\{(.*?)\}/ig)[0];
            {
              const name = c.match(/"name":"(.*?)"/ig)[0];
              const key = name.split(':')[0].replace(new RegExp('"', 'g'), '');
              const value = name.split(':')[1].replace(new RegExp('"', 'g'), '');
              result.spec.push({ key, value });
            }
            {
              const name = c.match(/"nb_jewels":\d{0,3}/ig)[0];
              const key = name.split(':')[0].replace(new RegExp('"', 'g'), '');
              const value = name.split(':')[1].replace(new RegExp('"', 'g'), '');
              result.spec.push({ key, value });
            }
            {
              const name = c.match(/"nb_parts":\d{0,3}/ig)[0];
              const key = name.split(':')[0].replace(new RegExp('"', 'g'), '');
              const value = name.split(':')[1].replace(new RegExp('"', 'g'), '');
              result.spec.push({ key, value });
            }
            {
              const name = c.match(/"frequency_vibrations":"(.*?)"/ig)[0];
              const key = name.split(':')[0].replace(new RegExp('"', 'g'), '');
              const value = name.split(':')[1].replace(new RegExp('"', 'g'), '');
              result.spec.push({ key, value });
            }
            {
              const name = c.match(/"power_reserve":"(.*?)"/ig)[0];
              const key = name.split(':')[0].replace(new RegExp('"', 'g'), '');
              const value = name.split(':')[1].replace(new RegExp('"', 'g'), ''); + ' hours';
              result.spec.push({ key, value });
            }
            {
              const name = c.match(/"functions":"(.*?)"/ig)[0];
              const key = name.split(':')[0].replace(new RegExp('"', 'g'), '');;
              const value = name.split(':')[1].replace(new RegExp('"', 'g'), '');;
              if (value) result.spec.push({ key, value });
            }
            {
              const name = c.match(/"special_1":"(.*?)"/ig)[0];
              const key = name.split(':')[0].replace(new RegExp('"', 'g'), '');;
              const value = name.split(':')[1].replace(new RegExp('"', 'g'), '');;
              if (value) result.spec.push({ key, value });
            }
            {
              const name = c.match(/"special_2":"(.*?)"/ig)[0];
              const key = name.split(':')[0].replace(new RegExp('"', 'g'), '');;
              const value = name.split(':')[1].replace(new RegExp('"', 'g'), '');;
              if (value) result.spec.push({ key, value });
            }
            {
              const name = c.match(/"special_3":"(.*?)"/ig)[0];
              const key = name.split(':')[0].replace(new RegExp('"', 'g'), '');;
              const value = name.split(':')[1].replace(new RegExp('"', 'g'), '');;
              if (value) result.spec.push({ key, value });
            }
            {
              const name = c.match(/"special_4":"(.*?)"/ig)[0];
              const key = name.split(':')[0].replace(new RegExp('"', 'g'), '');;
              const value = name.split(':')[1].replace(new RegExp('"', 'g'), '');;
              if (value) result.spec.push({ key, value });
            }
            {
              const name = c.match(/"special_5":"(.*?)"/ig)[0];
              const key = name.split(':')[0].replace(new RegExp('"', 'g'), '');;
              const value = name.split(':')[1].replace(new RegExp('"', 'g'), '');;
              if (value) result.spec.push({ key, value });
            }
            {
              const name = c.match(/"special_6":"(.*?)"/ig)[0];
              const key = name.split(':')[0].replace(new RegExp('"', 'g'), '');;
              const value = name.split(':')[1].replace(new RegExp('"', 'g'), '');;
              if (value) result.spec.push({ key, value });
            }
            {
              const name = c.match(/"special_7":"(.*?)"/ig)[0];
              const key = name.split(':')[0].replace(new RegExp('"', 'g'), '');;
              const value = name.split(':')[1].replace(new RegExp('"', 'g'), '');;
              if (value) result.spec.push({ key, value });
            }
            {
              const name = c.match(/"special_8":"(.*?)"/ig)[0];
              const key = name.split(':')[0].replace(new RegExp('"', 'g'), '');;
              const value = name.split(':')[1].replace(new RegExp('"', 'g'), '');;
              if (value) result.spec.push({ key, value });
            }
            {
              const name = c.match(/"special_9":"(.*?)"/ig)[0];
              const key = name.split(':')[0].replace(new RegExp('"', 'g'), '');;
              const value = name.split(':')[1].replace(new RegExp('"', 'g'), '');;
              if (value) result.spec.push({ key, value });
            }
          }
        })
      }
    })
  } catch (error) {
    console.error('Failed extraction for Audemars Piguet with error : ' + error);
    console.error('entry : ', entry);
    if (error.response) result.code = error.response.status;
    else result.code = 'UNKNOWN ERROR';
  }
  return result;
};

// const extraction = async (context) => {
//   const { client, entry, base, ...rest } = context;
//   const result = { ...rest, url: entry, spec: [], related: [], };
//   try {
//     const { data } = await client.get(entry);
//     const $ = cheerio.load(data);
//     console.log(entry)
//     // result.reference = $('.watch-detail-header__reference-number').text().trim().replace(/(?:\r\n|\r|\n|\s+)/g, " ").replace('Ref. ', '').replace('#', '');
//     result.reference = $('meta[name="watch-reference"]').attr('content').toUpperCase();
//     const jsonData = 'https://www.audemarspiguet.com/api/v1/watchprice/?lang=en&reference=' + result.reference;
//     const json = (await axios.get(jsonData)).data;
//     result.thumbnail = base + $('.odo-responsive-img').find('source').first().attr('srcset').split(',')[0].split(' ')[0];
//     result.retail = json['data'][7]['price']['formatted_price'].replace('&#36;', '$');
//     result.name = $('.watch-detail-header__title').text().trim();
//     result.collection = entry.split('/watch-collection/')[1].split('/')[0].toUpperCase();
//     result.description = $('.watch-detail-header__description-container .type-body-2').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
//     // result.description = json['data'][7]['watch']['description'].replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();

//     if (result.description.indexOf('woman') > -1) result.gender = 'F';
//     else result.gender = 'M';
//     {
//       const key = $(".case-feature-specs__main").find("h2").text();
//       const value = $(".case-feature-specs__main").find("p").text();
//       if (key || value) result.spec.push({ key, value });
//     }
//     $(".case-feature-specs__stats").find(".stat__content-wrap").each((idx, el) => {
//       const key = $(el).find(".stat__name-container").text();
//       const value = $(el).find(".stat__units-container").text();
//       if (key || value) result.spec.push({ key, value });
//     })
//     $(".case-feature-specs__secondary").find(".case-feature-specs__content-item").each((idx, el) => {
//       const key = $(el).find("h5").text();
//       const value = $(el).find("p").text();
//       if (key || value) result.spec.push({ key, value });
//     })

//     {
//       const key = $(".watch-mechanisms__mechanisms-container").find("h2").text();
//       const value = $(".watch-mechanisms__mechanisms-container").find("p").text();
//       if (key || value) result.spec.push({ key, value });
//     }
//     {
//       const key = 'movement';
//       const value = $(".watch-mechanisms__stats").find(".stat__name-container").text();
//       if (value) result.spec.push({ key, value });
//     }

//     $('script').each((idx, el) => {
//       const d = $(el).contents().toString();
//       if (d.match(/window.code1159\[\'watch-details\'\]/i)) {
//         const dd = d.split('\n');
//         dd.forEach(d => {
//           if (d.match(/window.code1159\[\'watch-details\'\]/i) && d.match(/"calibre"/i)) {
//             const dd = d.replace("window.code1159['watch-details'] = ", "");
//             const c = dd.match(/"calibre":\{(.*?)\}/ig)[0];
//             {
//               const name = c.match(/"name":"(.*?)"/ig)[0];
//               const key = name.split(':')[0].replace(new RegExp('"', 'g'), '');
//               const value = name.split(':')[1].replace(new RegExp('"', 'g'), '');
//               result.spec.push({ key, value });
//             }
//             {
//               const name = c.match(/"nb_jewels":\d{0,3}/ig)[0];
//               const key = name.split(':')[0].replace(new RegExp('"', 'g'), '');
//               const value = name.split(':')[1].replace(new RegExp('"', 'g'), '');
//               result.spec.push({ key, value });
//             }
//             {
//               const name = c.match(/"nb_parts":\d{0,3}/ig)[0];
//               const key = name.split(':')[0].replace(new RegExp('"', 'g'), '');
//               const value = name.split(':')[1].replace(new RegExp('"', 'g'), '');
//               result.spec.push({ key, value });
//             }
//             {
//               const name = c.match(/"frequency_vibrations":"(.*?)"/ig)[0];
//               const key = name.split(':')[0].replace(new RegExp('"', 'g'), '');
//               const value = name.split(':')[1].replace(new RegExp('"', 'g'), '');
//               result.spec.push({ key, value });
//             }
//             {
//               const name = c.match(/"power_reserve":"(.*?)"/ig)[0];
//               const key = name.split(':')[0].replace(new RegExp('"', 'g'), '');
//               const value = name.split(':')[1].replace(new RegExp('"', 'g'), ''); + ' hours';
//               result.spec.push({ key, value });
//             }
//             {
//               const name = c.match(/"functions":"(.*?)"/ig)[0];
//               const key = name.split(':')[0].replace(new RegExp('"', 'g'), '');;
//               const value = name.split(':')[1].replace(new RegExp('"', 'g'), '');;
//               if (value) result.spec.push({ key, value });
//             }
//             {
//               const name = c.match(/"special_1":"(.*?)"/ig)[0];
//               const key = name.split(':')[0].replace(new RegExp('"', 'g'), '');;
//               const value = name.split(':')[1].replace(new RegExp('"', 'g'), '');;
//               if (value) result.spec.push({ key, value });
//             }
//             {
//               const name = c.match(/"special_2":"(.*?)"/ig)[0];
//               const key = name.split(':')[0].replace(new RegExp('"', 'g'), '');;
//               const value = name.split(':')[1].replace(new RegExp('"', 'g'), '');;
//               if (value) result.spec.push({ key, value });
//             }
//             {
//               const name = c.match(/"special_3":"(.*?)"/ig)[0];
//               const key = name.split(':')[0].replace(new RegExp('"', 'g'), '');;
//               const value = name.split(':')[1].replace(new RegExp('"', 'g'), '');;
//               if (value) result.spec.push({ key, value });
//             }
//             {
//               const name = c.match(/"special_4":"(.*?)"/ig)[0];
//               const key = name.split(':')[0].replace(new RegExp('"', 'g'), '');;
//               const value = name.split(':')[1].replace(new RegExp('"', 'g'), '');;
//               if (value) result.spec.push({ key, value });
//             }
//             {
//               const name = c.match(/"special_5":"(.*?)"/ig)[0];
//               const key = name.split(':')[0].replace(new RegExp('"', 'g'), '');;
//               const value = name.split(':')[1].replace(new RegExp('"', 'g'), '');;
//               if (value) result.spec.push({ key, value });
//             }
//           }
//         })
//       }
//     })
//   } catch (error) {
//     console.log('Error extracting for ... with error: ', error)
//     if (error.response) result.code = error.response.status;
//     else result.code = 'UNKNOWN ERROR';
//   }
//   return result;
// }


(async () => {
  // const client = axios.create({
  //   headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/601.3.9 (KHTML, like Gecko) Version/9.0.2 Safari/601.3.9' }
  // });

  // const r = await indexing({
  //   client: axios,
  //   entry: 'https://www.audemarspiguet.com/en/sitemapxml/watch-browser/',
  //   brandID: 18,
  //   brand: "Audemars Piguet",
  //   base: "https://www.audemarspiguet.com",
  // });
  // console.log(r);

  // for (let i = 0; i < 1; i++) {
  // for (let i = 0; i < r.collections.length; i++) {
  //   const c = r.collections[i];
  //   for (let j = 0; j < 1; j++) {
  //     // for (let j = 0; j < r.items[c].length; j++) {
  //     // console.log(r.items[c][j]);
  //     const ex = await extraction({
  //       ...r.items[c][j],
  //       client: axios,
  //       entry: r.items[c][j]['url'],
  //       base: "https://www.audemarspiguet.com",
  //     });
  //     console.log(ex);
  //     console.log()
  //     console.log()
  //     // console.log(ex.url)
  //     // ex.spec.forEach(s => {
  //     //   console.log(s.key + ' | ' + s.value);
  //     // });
  //     // console.log()
  //     // await new Promise(r => setTimeout(r, 3000));
  //   }
  // }

  const rr = [
    {
      "url": "https://www.audemarspiguet.com/en/watch-collection/royal-oak/26510OR.OO.1220OR.01",
      "brand": "Audemars Piguet",
      "brandID": 18,
    },
    {
      "url": "https://www.audemarspiguet.com/en/watch-collection/royal-oak/26510ST.OO.1220ST.01",
      "brand": "Audemars Piguet",
      "brandID": 18,
    },
    {
      "url": "https://www.audemarspiguet.com/en/watch-collection/royal-oak/26322OR.ZZ.1222OR.01",
      "brand": "Audemars Piguet",
      "brandID": 18,
    },
    {
      "url": "https://www.audemarspiguet.com/en/watch-collection/royal-oak/26517SR.OO.1220SR.01",
      "brand": "Audemars Piguet",
      "brandID": 18,
    },
    {
      "url": "https://www.audemarspiguet.com/en/watch-collection/royal-oak/15202BA.OO.1240BA.01",
      "brand": "Audemars Piguet",
      "brandID": 18,
    },
    {
      "url": "https://www.audemarspiguet.com/en/watch-collection/royal-oak/15202BA.OO.1240BA.02",
      "brand": "Audemars Piguet",
      "brandID": 18,
    },
    {
      "url": "https://www.audemarspiguet.com/en/watch-collection/royal-oak/26347TI.OO.1205TI.01",
      "brand": "Audemars Piguet",
      "brandID": 18,
    },
    {
      "url": "https://www.audemarspiguet.com/en/watch-collection/royal-oak/26347OR.OO.1205OR.01",
      "brand": "Audemars Piguet",
      "brandID": 18,
    },
  ];
  const client = axios.create({
    headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_0_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.66 Safari/537.36' }
    // headers: { 'User-Agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.66 Safari/537.36" }
  });

  for (let i = 0; i < rr.length; i++) {
    const ex = await extraction({
      ...rr[i],
      client,
      entry: rr[i].url,
    });
    console.log(ex);
    await new Promise(r => setTimeout(r, 5000))
  }
})();