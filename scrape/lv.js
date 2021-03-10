const axios = require('axios');
const cheerio = require('cheerio');
const { Mappers, } = require('./utils');

const indexing = async (context) => {
  const { client, entry, base, } = context;
  const baseURL = base ? base : "https://us.louisvuitton.com";
  const source = "official";
  const lang = "en";
  const brand = "Louis Vuitton";
  const brandID = 130;
  const result = { source, lang, brand, brandID, collections: ['all'], items: { 'all': [] } };
  try {
    // const base = "https://us.louisvuitton.com";
    const urls = [
      'https://us.louisvuitton.com/eng-us/men/watches-and-jewelry/watches/_/N-1lzp3uf',
      'https://us.louisvuitton.com/eng-us/women/watches/watches/_/N-1s264nu',
    ];
    for (let url of urls) {
      const { data } = await client.get(url);
      const $ = cheerio.load(data);
      const lastpage = $('.lv-paginated-list__hidden-links > a').last().attr('href');
      let numPages = 0;
      if (lastpage.match(/page=/i)) {
        numPages = parseInt(lastpage.split('page=')[1]);
      }
      for (let i = 1; i <= numPages; i++) {
        const link = url + '?page=' + i;
        console.debug(link);
        const { data } = await client.get(link);
        const $ = cheerio.load(data);
        const pr = data.match(/price:"\$\d{0,3},?\d{0,3},?\d{3}.\d{2}",productId:"\w+"/ig);
        const ids = []; const prices = [];
        pr.forEach(d => {
          const pid = d.split(',productId:')[1].replace(/"/g, '');
          const prc = d.split(',productId:')[0].replace('price:', '').replace(/"/g, '');
          prices.push(prc); ids.push(pid);
        })
        $('.lv-product-card.-compact-large').each((idx, el) => {
          const url = baseURL + $(el).find('a').attr('href');
          const name = $(el).find('a').text().trim();
          const reference = $(el).find('span').attr('id').replace('product-', '');
          const gender = url.match(/women/) ? 'F' : 'M';
          const th = $(el).find('img').attr('data-srcset');
          const thumbnail = th.split('?')[0];
          const id = url.split('-');
          const fid = id[id.length - 1];
          let retail = null;
          if (ids.indexOf(fid) >= 0) {
            let idx = ids.indexOf(fid);
            retail = prices[idx];
          }
          result.items['all'].push({
            source, lang, brand, brandID, url, name, reference,
            retail, thumbnail, gender,
          });
        })
      }
    }
    return result;
  } catch (error) {
    console.error('Failed indexing for Louis Vuitton with error : ', error)
    return {};
  }
};

const extraction = async (context) => {
  const { client, entry, ...rest } = context;
  const result = { ...rest, url: entry, spec: [], related: [], };
  try {
    const data = (await client.get(entry)).data;
    const $ = cheerio.load(data);
    result.thumbnail = $('meta[property="og:image"]').attr('content');
    result.description = $('.lv-product-description').text().trim();
    $('.lv-product-features').find('li').each((idx, el) => {
      result.spec.push({ key: 'features', value: $(el).text().trim() })
    })
    $('script').each((idx, el) => {
      const ty = $(el).attr('data-hid');
      if (ty === 'utag_data') {
        const dd = $(el).contents()['0']['data'];
        const j = dd.replace('var utag_data=', '').replace(';', '');
        const data = JSON.parse(j);
        result.gender = Mappers.getGender.map(data.gender);
        result.retail = data.productPrice;
        result.reference = data.productSku;
        result.name = data.productName;
      }
    })
  } catch (error) {
    console.error('Failed extraction for Louis Vuitton with error : ' + error);
    console.error('entry :', entry);
    if (error.response) result.code = error.response.status;
    else result.code = 'UNKNOWN ERROR';
  }
  return result;
};


(async () => {
  // const r = await indexing({
  //   client: axios,
  //   entry: "",
  //   base: "https://us.louisvuitton.com",
  // });
  // r.items['all'].forEach(w => console.log(w))

  const r = [
    'https://us.louisvuitton.com/eng-us/products/tambour-slim-star-blossom-35-nvprod2140112v',
    'https://us.louisvuitton.com/eng-us/products/tambour-damier-cobalt-chronograph-nvprod1780144v',
    'https://us.louisvuitton.com/eng-us/products/escale-time-zone-spacecraft-nvprod1420001v',
  ];

  const values = []
  for (let i = 0; i < r.length; i++) {
    const ex = await extraction({
      client: axios,
      entry: r[i],
      base: "https://us.louisvuitton.com",
    });
    // ex.spec.forEach(v => {
    //   if (values.indexOf(v.value) < 0) values.push(v.value);
    // })
    console.log(ex);
  }

  console.log();
  console.log('*** done ***')
  process.exit(0)
})();