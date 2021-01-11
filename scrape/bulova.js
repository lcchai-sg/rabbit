const axios = require('axios');
const xml2js = require('xml2js');
const cheerio = require('cheerio');

const extraction = async (context) => {
  try {
    const { client, entry, source, lang, brand, brandID, name, collection, gender, reference, thumbnail, } = context;
    const result = {
      source,
      lang,
      brand,
      brandID,
      url: entry,
      name,
      reference,
      collection,
      gender,
      thumbnail,
      spec: [],
      related: [],
    }
    const data = (await client.get(entry)).data;
    const $ = cheerio.load(data);

    result.description = $('.product-description').find('p').text().trim();
    $('meta').each((idx, el) => {
      const m = $(el).attr('property');
      if (m === 'og:price:currency') result.currency = $(el).attr('content');
      if (m === 'og:price:amount') result.price = $(el).attr('content');
    })

    // result.spec.push({ cat: 'Features', key: '', value: $('.product-detail__details').find('h2').text().trim(), });
    $('.product-wrap > ul > li').each((idx, el) => {
      const attr = $(el).text().trim();
      const kv = attr.split(':');
      if (kv.length === 2) {
        const key = kv[0];
        const value = kv[1];
        result.spec.push({ key, value });
      } else {
        const key = '';
        const value = kv[0];
        result.spec.push({ key, value });
      }
    })
    return result;
  } catch (error) {
    const { entry, lang, source, } = context;
    console.error('Failed extraction for Baume et Mercier with error : ' + error);
    console.error('url:', entry);
    return { source, url: entry, lang, code: error.response.status, }
  }
};

(async () => {
  const entry = "https://intl.bulova.com/sitemap_products_1.xml?from=4298068545&to=4254557372463";
  const { data } = await axios.get(entry);
  const parser = new xml2js.Parser();
  const result = [];
  parser.parseString(data, (err, res) => {
    for (let i = 1; i < res.urlset.url.length; i++) {
      const url = res.urlset.url[i]['loc'][0];
      const name = res.urlset.url[i]['image:image'][0]['image:title'][0];
      const thumbnail = res.urlset.url[i]['image:image'][0]['image:loc'][0];

      if (url.match(/\b\d\d[a-z]\d\d\d\b|\b\d\d[a-z]\d\d\b/i)) {
        const reference = name.split(' ')[0];
        result.push({ url, name, reference, thumbnail, })
      }
    }
  });
  // result.forEach(v => console.log(v));

  // const u = [
  //   {
  //     url: 'https://intl.bulova.com/products/97m115',
  //     name: "97M115 Women's Classic Watch",
  //     reference: '97M115',
  //     thumbnail: 'https://cdn.shopify.com/s/files/1/1128/6670/products/97m115.png?v=1567188449'
  //   },
  //   {
  //     url: 'https://intl.bulova.com/products/97p131',
  //     name: '97P131 Special Edition Lady Ganga Watch',
  //     reference: '97P131',
  //     thumbnail: 'https://cdn.shopify.com/s/files/1/1128/6670/products/97p131.png?v=1567188448'
  //   },
  //   {
  //     url: 'https://intl.bulova.com/products/78l128',
  //     name: "78L128 Harley-Davidson Women's Watch",
  //     reference: '78L128',
  //     thumbnail: 'https://cdn.shopify.com/s/files/1/1128/6670/products/78l128.png?v=1567188447'
  //   },
  //   {
  //     url: 'https://intl.bulova.com/products/96p191',
  //     name: "96P191 Women's Classic Automatic Watch",
  //     reference: '96P191',
  //     thumbnail: 'https://cdn.shopify.com/s/files/1/1128/6670/products/96p191.png?v=1567188491'
  //   },
  //   {
  //     url: 'https://intl.bulova.com/products/96a204',
  //     name: "96A204 Men's Futuro Automatic Watch",
  //     reference: '96A204',
  //     thumbnail: 'https://cdn.shopify.com/s/files/1/1128/6670/products/96a204.png?v=1567188490'
  //   },
  //   {
  //     url: 'https://intl.bulova.com/products/98a203',
  //     name: "98A203 Men's Futuro Automatic Watch",
  //     reference: '98A203',
  //     thumbnail: 'https://cdn.shopify.com/s/files/1/1128/6670/products/98a203.png?v=1567188489'
  //   },
  //   {
  //     url: 'https://intl.bulova.com/products/96k101',
  //     name: "96K101 Special Edition Chronograph C Men's Watch",
  //     reference: '96K101',
  //     thumbnail: 'https://cdn.shopify.com/s/files/1/1128/6670/products/96k101.png?v=1567188580'
  //   },
  //   {
  //     url: 'https://intl.bulova.com/products/98b303',
  //     name: "98B303 Special GRAMMY¬Æ Edition Men's Precisionist Watch",
  //     reference: '98B303',
  //     thumbnail: 'https://cdn.shopify.com/s/files/1/1128/6670/products/98b303.png?v=1567188579'
  //   }
  // ]

  const u = result;
  for (let i = 0; i < u.length; i++) {
    const ex = await extraction({
      client: axios,
      entry: u[i].url,
      source: "official",
      lang: "en",
      brand: "Bulova",
      brandID: 268,
      name: u[i].name,
      collection: "",
      gender: "",
      reference: u[i].reference,
      thumbnail: u[i].thumbnail,
    });

    const d = ex.description.split('.');
    for (let i = 0; i < d.length; i++) {
      if (d[i].indexOf(',') > 0) {
        const dd = d[i].split(',');
        dd.forEach(ddd => console.log('   ', ddd));
      } else {
        console.log(d[i]);
      }
    }
    console.log()
  }
})();