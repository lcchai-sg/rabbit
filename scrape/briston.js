const axios = require('axios');
const cheerio = require('cheerio');

const indexing = async (context) => {
  const { client, entry, base, } = context;
  const source = "official";
  const lang = "en";
  const brand = "Briston";
  const brandID = 282;
  const result = { source, lang, brand, brandID, collections: [], items: {} };
  const collections = [];
  try {
    const { data } = await client.get(entry);
    const $ = cheerio.load(data);
    $('.promo-banner-wrapper').each((idx, el) => {
      const name = $(el).find('h4').text();
      const url = $(el).find('.promo-banner').attr('onclick').replace('window.location.href=', '').replace(/\'/g, '');
      collections.push({ name, url })
    });
    for (const c of collections) {
      let next = c.url;
      do {
        if (result.collections.indexOf(c.name) < 0) {
          result.collections.push(c.name);
          result.items[c.name] = [];
        }
        console.log(next);
        const { data } = await client.get(next);
        const $ = cheerio.load(data);
        $('.product-grid-item').each((idx, el) => {
          const name = $(el).find('span').attr('data-gtm4wp_product_name');
          const price = $(el).find('.price').text();
          // const price = $(el).find('.price').attr('data-gtm4wp_product_price');
          const g = $(el).find('span').attr('data-gtm4wp_product_cat');
          const gender = (g.match(/women/i)) ? 'F' : 'M';
          const url = $(el).find('span').first().attr('data-gtm4wp_product_url');
          const thumbnail = $(el).find('img').first().attr('src');
          const refr = url.split('/');
          const ref = refr[refr.length - 2].split('-');
          const ref1 = ref.length >= 5 ? ref.slice(ref.length - 5, ref.length).join('.').toUpperCase() : null;
          let reference = '';
          if (!ref1) {
            const refr = thumbnail.split('/');
            const ref = refr[refr.length - 1].split('-');
            const ref2 = ref.slice(ref.length - 6, ref.length - 1).join('.').toUpperCase();
            reference = ref2
          } else reference = ref1;
          result.items[c.name].push({
            source, lang, brand, brandID, collection: c.name, url, name,
            reference, thumbnail, price, gender,
          });
        })
        next = $('link[rel="next"]').attr('href');
      } while (next);
    }
    return result;
  } catch (error) {
    console.error('Failed indexing for Briston with error : ' + error)
    return {};
  }
};

const extraction = async (context) => {
  const { client, entry, ...other } = context;
  const result = { url: entry, ...other, spec: [], related: [], }
  try {
    const data = (await client.get(entry)).data;
    const $ = cheerio.load(data);
    result.name = $('.product_title').text();
    result.price = $('.price').first().text();
    result.shortDesc = $('.woocommerce-product-details__short-description').text().replace(/(?:\r\n|\r|\n|\s+)/g, ' ').trim();
    result.description = $('#tab-description').find('p').first().text();
    $('#tab-description').find('tr').each((idx, el) => {
      const key = $(el).find('th').text();
      const value = $(el).find('td').text();
      result.spec.push({ key, value });
    })
    return result;
  } catch (error) {
    console.error('Failed extraction for Briston with error : ' + error);
    console.error('url:', entry);
    result.code = error.response.status;
  }
  return result;
};

(async () => {
  const r = await indexing({
    client: axios,
    entry: "https://www.briston-watches.com/en/watches/",
  });
  console.log()
  // console.log(r);
  // r.collections.forEach(c => {
  //   console.log('collection...', c)
  //   r.items[c].forEach(v => console.log(v));
  // });

  // const r = [
  //   {
  //     source: 'official',
  //     lang: 'en',
  //     brand: 'Briston',
  //     brandID: 282,
  //     collection: 'CLUBMASTER CLASSIC',
  //     url: 'https://www.briston-watches.com/en/product/clubmaster-classic-acetate-gold-15140-pya-t-10-nbg/',
  //     name: 'CLUBMASTER CLASSIC ACETATE GOLD',
  //     reference: '15140.PYA.T.10.NBG',
  //     thumbnail: 'https://www.briston-watches.com/wp-content/uploads/2019/10/briston-clubmaster-classic-acetate-15140-PYA-T-10-NBG-600x600.jpg',
  //     price: '€290.00',
  //     gender: 'F'
  //   },
  //   {
  //     source: 'official',
  //     lang: 'en',
  //     brand: 'Briston',
  //     brandID: 282,
  //     collection: 'CLUBMASTER SPORT',
  //     url: 'https://www.briston-watches.com/en/product/clubmaster-sport-acetate-17142-sa-ts-11-ng/',
  //     name: 'CLUBMASTER SPORT ACETATE',
  //     reference: '17142.SA.TS.11.NG',
  //     thumbnail: 'https://www.briston-watches.com/wp-content/uploads/2019/10/clubmaster-sport-acetate-17142-sa-ts-11-ng-1-600x600.jpg',
  //     price: '€290.00',
  //     gender: 'M'
  //   },
  //   {
  //     source: 'official',
  //     lang: 'en',
  //     brand: 'Briston',
  //     brandID: 282,
  //     collection: 'CLUBMASTER CHIC',
  //     url: 'https://www.briston-watches.com/en/product/clubmaster-chic-steel-17536-s-l-1-nb/',
  //     name: 'CLUBMASTER CHIC STEEL',
  //     reference: '17536.S.L.1.NB',
  //     thumbnail: 'https://www.briston-watches.com/wp-content/uploads/2019/10/clubmaster-chic-acier-17536-S-L-1-NB-600x600.jpg',
  //     price: '€160.00',
  //     gender: 'F'
  //   },
  //   {
  //     source: 'official',
  //     lang: 'en',
  //     brand: 'Briston',
  //     brandID: 282,
  //     collection: 'STREAMLINER SKELETON',
  //     url: 'https://www.briston-watches.com/en/product/streamliner-skeleton-steel-gold-201042-sprg-sk-2-c/',
  //     name: 'STREAMLINER SKELETON STEEL GOLD',
  //     reference: '201042.SPRG.SK.2.C',
  //     thumbnail: 'https://www.briston-watches.com/wp-content/uploads/2020/08/Streamliner-skeleton-steel-gold-201042-SPRG-SK-2-C-600x600.jpg',
  //     price: '$810.00',
  //     gender: 'M'
  //   },
  // ];

  for (let i = 0; i < r.collections.length; i++) {
    const c = r.collections[i];
    for (let j = 0; j < r.items[c].length; j++) {
      const ex = await extraction({
        ...r.items[c][i],
        client: axios,
        entry: r.items[c][i].url,
      });
      console.log(ex.url);
      ex.spec.forEach(s => console.log(s.key + ' | ' + s.value));
      console.log();
    }
  }
})();