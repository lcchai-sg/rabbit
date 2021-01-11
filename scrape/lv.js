const axios = require('axios');
const cheerio = require('cheerio');

const indexing = async context => {
  const urls = [
    'https://us.louisvuitton.com/eng-us/men/watches-and-jewelry/watches/_/N-1lzp3uf',
    'https://us.louisvuitton.com/eng-us/women/watches/watches/_/N-1s264nu',
  ];
  const base = "https://us.louisvuitton.com";

  const result = [];

  for (let url of urls) {
    try {
      const { data } = await axios.get(url);
      const $ = cheerio.load(data);
      const lastpage = $('.lv-paginated-list__hidden-links > a').last().attr('href');
      let numPages = 0;
      if (lastpage.match(/page=/i)) {
        numPages = parseInt(lastpage.split('page=')[1]);
      }
      for (let i = 1; i <= numPages; i++) {
        const link = url + '?page=' + i;
        console.log(link);
        const { data } = await axios.get(link);
        const $ = cheerio.load(data);
        $('.lv-smart-link.lv-product-card').each((idx, el) => {
          const url = base + $(el).attr('href');
          const th = $(el).find('noscript').contents();
          const thumbnail = th['0'].data.split('=')[1].replace(new RegExp('"', 'g'), '').replace(' alt', '');
          const ref = thumbnail.split('/');
          const reference = ref[ref.length - 1].split('_')[0]
          const name = $(el).find('.lv-product-card__name').text().trim();
          result.push({ url, thumbnail, name, reference, });
        })
      }
    } catch (error) {
      console.log(error);
    }
  }
  return result;
}

const extraction = async context => {
  const { url, thumbnail, name, reference, } = context;
  const result = { url, thumbnail, name, reference, spec: [], };
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);
  // result.description = $('#productDescription').text().trim();
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
      result.gender = data.gender;
      result.price = data.productPrice;
    }
  })

  // $('script').each((idx, el) => {
  //   const ty = $(el).attr('type');
  //   if (ty === 'application/ld+json') {
  //     const dd = $(el).contents();
  //     const data = JSON.parse(dd);
  //     if (data['@type'] === 'Product') {
  //       result.description = data.description;
  //       result.price = data.offers && data.offers.price ? data.offers.price : null;
  //       result.currency = data.offers && data.offers.priceCurrency ? data.offers.priceCurrency : null;
  //     }
  //   }
  // })
  // result.description1 = $('#productDescription').text().trim();
  // $('#text_productFeatures').find('li').each((idx, el) => {
  //   result.spec.push({ key: 'features', value: $(el).text().trim() })
  // })

  return result;
}

(async () => {
  // const r = await indexing();
  // console.log(r);
  const r = [
    {
      url: 'https://us.louisvuitton.com/eng-us/products/tambour-slim-star-blossom-35-nvprod2140112v',
      thumbnail: 'https://www.louisvuitton.com/images/QBB125_PM2_Front%20View',
      name: 'Tambour Slim Star Blossom 35',
      reference: 'QBB125'
    },
    {
      url: 'https://us.louisvuitton.com/eng-us/products/tambour-world-tour-28-nvprod2460067v',
      thumbnail: 'https://www.louisvuitton.com/images/QBB137_PM2_Front%20view',
      name: 'Tambour World Tour 28',
      reference: 'QBB137'
    },
    {
      url: 'https://us.louisvuitton.com/eng-us/products/tambour-world-tour-34-nvprod2460068v',
      thumbnail: 'https://www.louisvuitton.com/images/QBB138_PM2_Front%20view',
      name: 'Tambour World Tour 34',
      reference: 'QBB138'
    },
    {
      url: 'https://us.louisvuitton.com/eng-us/products/tambour-world-tour-395-nvprod2460069v',
      thumbnail: 'https://www.louisvuitton.com/images/QBB139_PM2_Front%20view',
      name: 'Tambour World Tour 39.5',
      reference: 'QBB139'
    }
  ];

  const values = []
  for (let i = 0; i < r.length; i++) {
    const ex = await extraction(r[i]);
    // ex.spec.forEach(v => {
    //   if (values.indexOf(v.value) < 0) values.push(v.value);
    // })
    console.log(ex);
  }

  console.log();
  console.log('*** done ***')
  process.exit(0)
})();