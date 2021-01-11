const axios = require('axios');
const cheerio = require('cheerio');
const sitemapper = require('sitemapper');

const indexing = async (context) => {
  try {
    const { client, entry, } = context;
    const result = { collections: [], items: {} };
    const sitemap = new sitemapper({
      url: entry,
      timeout: 300000,
    });
    const d = await sitemap.fetch();
    d.sites.forEach(w => {
      if (!w.match(/digital/i)) {
        const url = w;
        const ref = url.split('/');
        const refr = ref[ref.length - 1].toUpperCase().split('-');
        const collection = refr[0];
        if (result.collections.indexOf(collection) < 0) {
          result.collections.push(collection);
          result.items[collection] = [];
        }
        const reference = refr.slice(refr.length - 5, refr.length - 2).join('.') + '/' + refr.slice(refr.length - 2, refr.length).join('.');
        const name = refr.slice(0, refr.length - 5).join(' ').toUpperCase();
        result.items[collection].push({
          url, collection, name, reference,
        })
      }
    })
    return result;
  }
  catch (error) {
    console.log('Failed indexing for Zenith with error : ' + error);
    return {};
  }
};


const extraction = async (context) => {
  const { client, entry, ...rest } = context;
  const result = { ...rest, url: entry, spec: [], related: [], features: [] };
  const imageBase = "https://shop.zenith-watches.com/media/catalog/product";
  try {
    console.log('entry >>>>>', entry)
    const $ = cheerio.load((await client.get(entry)).data);
    result.collection = $(".h6.tag.-upper").text();
    result.name = $(".h4.title.-upper").text();
    result.description = $(".description").text();
    result.reference = $(".ref").text();
    result.price = $(".price.h5").text();
    if ($('.editorial-content').text())
      result.spec.push({
        key: 'editorial',
        value: $('.editorial-content').text(),
      });
    // result.editorial = $('.editorial-content').text();

    $('script').each((idx, el) => {
      if ($(el).contents()['0']) {
        const c = $(el).contents()['0']['data'];
        if (c.match(/window.__INITIAL_STATE__=/i)) {
          const d = c.replace('window.__INITIAL_STATE__=', '').split("(function()")[0];
          const dd = d.slice(0, d.length - 1);
          const j = JSON.parse(dd)
          const p = j.prismic.pages;
          Object.keys(p).forEach(key => {
            const pk = p[key]
            // console.log(pk)
            const slash = new RegExp('\u002F', 'gi')
            if (pk.main.description) result.description = pk.main.description.replace(slash, '/');
            const pr = pk.main.product.product.en_us;
            if (pr.sku) result.reference = pr.sku.replace(slash, '/');
            if (pr.image) result.image = imageBase + pr.image.replace(slash, '/');

            Object.keys(pr).forEach(k => {
              if (k.match(/option_value_|function|hour_markers|jewels|components|selling_points/i)) {
                const key = k.toLowerCase().replace('option_value_', '');
                result.spec.push({ key, value: pr[k] });
              }
            })
          })

        }
      }
    })

    $('.hooper.-white').last().find('a').each((idx, el) => {
      result.related.push($(el).attr('datasku'));
    })
  } catch (error) {
    console.log('Failed extraction for Zenith with error : ' + error)
    if (error.response) result.code = error.response.status;
    else result.code = 'UNKNOW ERROR';
  }
  return result;
};


(async () => {
  const r = await indexing({
    entry: "https://www.zenith-watches.com/en_us/sitemap_2-product.xml",
    brandID: 80,
  })
  // console.log(r);
  // r.collections.forEach(c => {
  //   r.items[c].forEach(w => console.log(w))
  // })

  // const rr = [
  //   "https://www.zenith-watches.com/en_us/product/defy-double-tourbillon-10-9000-9020-79-r918",
  //   "https://www.zenith-watches.com/en_us/product/defy-midnight-16-9200-670-01-mi001",
  // ];

  // for (let i = 0; i < rr.length; i++) {
  //   const ex = await extraction({
  //     entry: rr[i],
  //     client: axios,
  //     brand: "Zenith",
  //     brandID: 80,
  //   })
  //   console.log(ex);
  // }

  // const r = [
  // {
  //   url: 'https://www.zenith-watches.com/en_us/product/elite-classic-16-3200-670-01-c831',
  //   collection: 'ELITE',
  //   name: 'ELITE CLASSIC',
  //   reference: '16.3200.670/01.C831'
  // },
  // {
  //   entry: "https://www.zenith-watches.com/en_us/product/defy-el-primero-21-95-9002-9004-78-m9000",
  //   collection: "DEFY",
  //   name: "DEFY EL PRIMERO 21",
  //   reference: "95.9002.9004/78.M9000",
  // }
  // {
  //   url: 'https://www.zenith-watches.com/en_us/product/elite-moonphase-16-3200-692-01-c832',
  //   collection: 'ELITE',
  //   name: 'ELITE MOONPHASE',
  //   reference: '16.3200.692/01.C832'
  // },
  // {
  //   url: 'https://www.zenith-watches.com/en_us/product/elite-classic-03-3100-670-01-c922',
  //   collection: 'ELITE',
  //   name: 'ELITE CLASSIC',
  //   reference: '03.3100.670/01.C922'
  // },
  // {
  //   url: 'https://www.zenith-watches.com/en_us/product/elite-moonphase-03-3100-692-01-c922',
  //   collection: 'ELITE',
  //   name: 'ELITE MOONPHASE',
  //   reference: '03.3100.692/01.C922'
  // }
  // ];

  // for (let i = 0; i < r.length; i++) {
  //   const ex = await extraction({
  //     entry: r[i].url,
  //     client: axios,
  //     ...r[i],
  //   });
  //   console.log(ex);
  // }
  // for (let i = 0; i < 1; i++) {
  for (let i = 0; i < r.collections.length; i++) {
    const c = r.collections[i];
    // for (let j = 0; j < 1; j++) {
    for (let j = 0; j < r.items[c].length; j++) {
      const ex = await extraction({
        entry: r.items[c][j].url,
        client: axios,
        ...r.items[c][j],
      });
      // console.log(ex);
      ex.spec.forEach(s => console.log(s.key + " | " + s.value));
    }
  }

})();