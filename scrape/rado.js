const sitemapper = require('sitemapper');
const axios = require('axios');
const cheerio = require('cheerio');

const indexing = async context => {
  const { client, entry, } = context;
  const sitemap = new sitemapper({
    url: entry,
    timeout: 300000,
  });
  const d = await sitemap.fetch();
  const result = { collections: [], items: {}, }
  d.sites.forEach(s => {
    if (s.match(/\/collections\//i)) {
      const ss = s.split('/');
      if (ss && ss.length === 7) {
        const url = s;
        const reference = ss[ss.length - 1].toUpperCase();
        const name = ss[ss.length - 2].replace(/-/g, ' ').toUpperCase();
        const collection = ss[ss.length - 3].replace(/-/g, ' ').toUpperCase();
        if (result.collections.indexOf(collection) < 0) {
          result.collections.push(collection);
          result.items[collection] = [];
        }
        result.items[collection].push({
          url, collection, name, reference,
        })
      }
    }
  });
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
  // const r = await indexing({
  //   client: axios,
  //   entry: "https://www.rado.com/sitemap.xml",
  //   base: "https://www.rado.com/en_us",
  // });
  // console.log(r);
  // r.collections.forEach(c => {
  //   console.log(c)
  //   r.items[c].forEach(w => console.log(w))
  // })

  const rr = [
    {
      url: 'https://www.rado.com/en_us/collections/diastar-original/original/R12416773',
      collection: 'DIASTAR ORIGINAL',
      name: 'ORIGINAL',
      reference: 'R12416773'
    },
    {
      url: 'https://www.rado.com/en_us/collections/diastar-original/original/R12413783',
      collection: 'DIASTAR ORIGINAL',
      name: 'ORIGINAL',
      reference: 'R12413783'
    },
    {
      url: 'https://www.rado.com/en_us/collections/diastar-original/original/R12063013',
      collection: 'DIASTAR ORIGINAL',
      name: 'ORIGINAL',
      reference: 'R12063013'
    },
    {
      url: 'https://www.rado.com/en_us/collections/diastar-original/original/R12064253',
      collection: 'DIASTAR ORIGINAL',
      name: 'ORIGINAL',
      reference: 'R12064253'
    },
    {
      url: 'https://www.rado.com/en_us/collections/diastar-original/original/R12065403',
      collection: 'DIASTAR ORIGINAL',
      name: 'ORIGINAL',
      reference: 'R12065403'
    }
  ];

  for (let i = 0; i < rr.length; i++) {
    const ex = await extraction({
      ...rr[i],
      entry: rr[i].url,
      client: axios,
    })
    console.log(ex)
  }
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