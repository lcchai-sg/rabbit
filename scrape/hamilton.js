const sitemapper = require('sitemapper');
const axios = require('axios');
const cheerio = require('cheerio');
const xml2js = require('xml2js');

const xmlIndexing = async (context) => {
  try {
    const { client, entry, lang, } = context;
    const source = "official";
    const brand = "Hamilton";
    const brandID = 62;
    const result = { source, lang, brand, brandID, collections: ['all'], items: { 'all': [] } };
    const parser = new xml2js.Parser();
    await axios.get(entry).then(resp => {
      const data = resp.data;
      parser.parseString(data, (err, res) => {
        for (let i = 1; i < res.urlset.url.length; i++) {
          if (res.urlset.url[i].priority[0] === '1.0') {
            const url = res.urlset.url[i]['loc'][0];
            const name = res.urlset.url[i]['image:image'][0]['image:title'][0];
            const thumbnail = res.urlset.url[i]['image:image'][0]['image:loc'][0];

            let d = url.split('/');
            d = d[d.length - 1].replace('.html', '');
            d = d.split('-');
            let reference = '';
            if (d[0].match(/h[0-9]{8}/)) {
              reference = d[0].toUpperCase();
            } else {
              let r = d[d.length - 1].replace('.html', '');
              if (r.match(/h[0-9]{8}/)) {
                reference = r.toUpperCase();
              } else {
                reference = 'noRef' + i;
              }
            }

            result.items['all'].push({
              source, lang, brand, brandID,
              name, reference, url, thumbnail, price: null,
            })
          }
        }
      });
    });
    return result;
  } catch (error) {
    console.error('Failed for indexing class of Hamilton with error : ' + error);
    return {};
  }
}

const indexing = async context => {
  const { client, entry, } = context;
  const sitemap = new sitemapper({
    url: entry,
    timeout: 300000,
  });
  const d = await sitemap.fetch();
  d.sites.sort();
  // d.sites.forEach(v => console.log(v));
  const result = { collections: [], items: {}, };
  // d.sites.forEach(s => {
  for (let i = 0; i < d.sites.length; i++) {
    const url = d.sites[i];
    if (!(url.match(/store-locator/i) || url.match(/filter/i))) {
      try {
        const { data } = await axios.get(url);
        if (data.match(/availability/i) && (data.match(/case material/i) || data.match(/dial color/i))) {
          const col = data.match(/data-th="Collection">.*<\/td>/gi);
          if (col) {
            const coll = col ? col[0].match(/>.*</g) : null;
            const collection = coll ? coll[0].replace(">", "").replace("<", "") : null;
            if (collection && result.collections.indexOf(collection) < 0) {
              result.collections.push(collection);
              result.items[collection] = [];
            }
            const n = data.match(/name: ?'.*'/gi);
            const name = n ? n[0].split(':')[1].trim() : null;
            const r = data.match(/productId: ?'.*'/gi);
            const reference = r ? r[0].split(':')[1].trim() : null;
            result.items[collection].push({
              url, collection, name, reference,
            })
          } else {
            console.log(i, '       NOT WATCH (NO COLLECTION)> ', url);
          }
        } else {
          console.log(i, '       NOT WATCH > ', url);
        }
      } catch (error) {
        console.log();
        console.log(i, url);
        console.log(error)
        console.log();
      }
    }
    await new Promise(r => setTimeout(r, 1000));
  }
  // });
  return result;
}

const extraction = async (context) => {
  const { client, entry, } = context;
  const result = { url: entry, spec: [], related: [], };
  try {
    const $ = cheerio.load((await client.get(entry)).data);
    result.name = $('.swp-hero__title.swp-hero__title--desktop.htitle').text().trim().replace(/(?:\r\n|\r|\n|\s+)/g, " ");
    result.description = $('.swp-hero__text p').text().trim().replace(/(?:\r\n|\r|\n|\s+)/g, " ");
    result.retail = $('.price').text().trim().replace(/(?:\r\n|\r|\n|\s+)/g, " ");
    result.reference = $('.dash.dash--standard-size.swp-specifications__watch-codes').text().trim().replace(/(?:\r\n|\r|\n|\s+)/g, " ");
    result.gender = 'X';
    // $('.swp-slider .wrapper ul div div div li a ').each((idx, el) => {
    //   const related = $(el).find(' div .watch-block__price').text().trim().replace(/(?:\r\n|\r|\n|\s+)/g, " ");
    //   result.related.push(related);
    // });
    // $('.swp-hero__specs-item ').each((idx, el) => {
    //   const key = $(el).text().split(':')[0].replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
    //   const value = $(el).text().split(':')[1].replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
    //   result.spec.push({ key, value });
    // });
    // $('.swp-specifications__specs-item ').each((idx, el) => {
    //   const key = $(el).find('strong').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
    //   const value = $(el).find('span').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
    //   result.spec.push({ key, value });
    // });

    $('script[type="application/ld+json"]').each((idx, el) => {
      const s = $(el).contents().text();
      const d = JSON.parse(s);
      result.thumbnail = d.image;
      result.sku = d.sku;
      result.price = d.offers && d.offers.price ? d.offers.priceCurrency + d.offers.price : null;
    })
    $('.swp__you_may_also_like').find('a').each((idx, el) => {
      const d = JSON.parse($(el).attr('data-gmt-tracking'));
      result.related.push(d.id);
    })
  } catch (error) {
    console.log('Failed extraction for Rado with error : ' + error);
    result.code = error.response.status;
  }
  return result;
};

(async () => {
  const r = await xmlIndexing({
    client: axios,
    entry: "https://www.hamiltonwatch.com/pub/mediam2/sitemap/sitemap_en_us.xml",
    base: "https://www.hamiltonwatch.com",
  });
  console.log(r);
  console.log()
  let cnt = 0;
  r.collections.forEach(c => {
    console.log('..........', c);
    r.items[c].forEach(w => {
      console.log(w.url)
      cnt++
    })
  })
  console.log()
  console.log('total >', cnt)
  console.log()
  console.log('*** done ***')
  // console.log(r.length)
  // r.collections.forEach(c => {
  //   console.log(c)
  //   r.items[c].forEach(w => console.log(w))
  // })

  // const rr = [
  //   {
  //     url: 'https://www.rado.com/en_us/collections/diastar-original/original/R12416773',
  //     collection: 'DIASTAR ORIGINAL',
  //     name: 'ORIGINAL',
  //     reference: 'R12416773'
  //   },
  //   {
  //     url: 'https://www.rado.com/en_us/collections/diastar-original/original/R12413783',
  //     collection: 'DIASTAR ORIGINAL',
  //     name: 'ORIGINAL',
  //     reference: 'R12413783'
  //   },
  //   {
  //     url: 'https://www.rado.com/en_us/collections/diastar-original/original/R12063013',
  //     collection: 'DIASTAR ORIGINAL',
  //     name: 'ORIGINAL',
  //     reference: 'R12063013'
  //   },
  //   {
  //     url: 'https://www.rado.com/en_us/collections/diastar-original/original/R12064253',
  //     collection: 'DIASTAR ORIGINAL',
  //     name: 'ORIGINAL',
  //     reference: 'R12064253'
  //   },
  //   {
  //     url: 'https://www.rado.com/en_us/collections/diastar-original/original/R12065403',
  //     collection: 'DIASTAR ORIGINAL',
  //     name: 'ORIGINAL',
  //     reference: 'R12065403'
  //   }
  // ];

  // for (let i = 0; i < rr.length; i++) {
  //   const ex = await extraction({
  //     ...rr[i],
  //     entry: rr[i].url,
  //     client: axios,
  //   })
  //   console.log(ex)
  // }
  // const specs = [];
  // for (let i = 0; i < r.collections.length; i++) {
  //   const c = r.collections[i];
  //   for (let j = 0; j < r.items[c].length; j++) {
  //     const w = r.items[c][j];
  //     const ex = await extraction({
  //       ...w, entry: w.url, client: axios,
  //     });
  //     ex.spec.forEach(s => {
  //       const sp = s.key + '  ' + s.value;
  //       if (specs.indexOf(sp) < 0) specs.push(sp);
  //     })
  //   }
  // }

  // specs.sort();
  // specs.forEach(v => console.log(v))
})();