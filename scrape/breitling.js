const sitemapper = require('sitemapper')
const axios = require('axios');
const cheerio = require('cheerio');

const extraction = async (context) => {
  try {
    const { client, url: entry, source, lang, brand, brandID, collection, name, reference, price, } = context;
    const base = 'https://www.breitling.com';
    const result = {
      source,
      lang,
      brand,
      brandID,
      url: entry,
      collection,
      name,
      reference,
      price,
      spec: [],
      related: []
    };
    const { data } = await client.get(entry);
    if (!(data.match(/technical data/i))) {
      result.code = 'not product';
      return result;
    }
    const $ = cheerio.load(data);

    result.price = $('.pr-price').text().trim().replace(' Excl. Sales Tax.', '');
    result.name = $('.pr-informations h1').text().trim();
    // result.collection = entry.split('/watches/')[1].split('/')[0];
    result.thumbnail = base + $('.version-slider-cell').find('img').attr('src')
    // result.reference = $('.pr-reference').text().trim();
    result.gender = 'M';
    result.description = $('section > .brContent > div > div > p#version-description').text().trim();

    $('.dtechTab').each((idx, el) => {
      const cat = $(el).find('h3').text().trim();
      const keys = [];
      const values = [];
      $(el).find('dt').each((idx, el) => {
        keys.push($(el).text().trim())
      })
      $(el).find('dd').each((idx, el) => {
        values.push($(el).text().trim())
      })
      for (let i = 0; i < values.length; i++) {
        result.spec.push({ cat, key: keys[i], value: values[i] });
      }
    });
    return result;
  } catch (error) {
    console.log('Failed extraction for Breitling with error : ' + error);
    return {};
  }
};

(async () => {
  const sitemap = new sitemapper({
    url: "https://www.breitling.com/us-en/sitemap/collections.xml",
    timeout: 300000,
  });
  const sm = await sitemap.fetch();
  const result = [];
  sm.sites.forEach(url => {
    if (url.match(/watches/i)) {
      let v = url.split('/');
      if (v.length >= 8) {
        const collection = v[6].toUpperCase();
        const name = v[7].replace(new RegExp('-', 'g'), ' ').toUpperCase();
        let reference = '';
        if (v[v.length - 1] === '') {
          reference = v[v.length - 2].replace(new RegExp('-', 'g'), ' ').toUpperCase();
        } else {
          reference = v[v.length - 1].split('=')[1].replace(new RegExp('-', 'g'), ' ').toUpperCase();
        }
        result.push({ url, collection, name, reference, })
      }
    }
  });

  // const result = [
  //   {
  //     url: 'https://www.breitling.com/us-en/watches/navitimer/navitimer-automatic-35/A173951A1K1/',
  //     collection: 'NAVITIMER-AUTOMATIC-35',
  //     name: 'A173951A1K1',
  //     reference: 'A173951A1K1'
  //   },
  //   {
  //     url: 'https://www.breitling.com/us-en/watches/navitimer/navitimer-automatic-35/A173952A1C1/',
  //     collection: 'NAVITIMER-AUTOMATIC-35',
  //     name: 'A173952A1C1',
  //     reference: 'A173952A1C1'
  //   },
  //   {
  //     url: 'https://www.breitling.com/us-en/watches/navitimer/navitimer-automatic-35/A17395F41G1/',
  //     collection: 'NAVITIMER-AUTOMATIC-35',
  //     name: 'A17395F41G1',
  //     reference: 'A17395F41G1'
  //   },
  //   {
  //     url: 'https://www.breitling.com/us-en/watches/navitimer/navitimer-automatic-35/A17395201K1/?watch=A17395201K1P1',
  //     collection: 'NAVITIMER-AUTOMATIC-35',
  //     name: 'A17395201K1',
  //     reference: 'A17395201K1P1'
  //   },
  //   {
  //     url: 'https://www.breitling.com/us-en/watches/navitimer/navitimer-automatic-35/A17395F41G1/?watch=A17395F41G1P1',
  //     collection: 'NAVITIMER-AUTOMATIC-35',
  //     name: 'A17395F41G1',
  //     reference: 'A17395F41G1P1'
  //   },
  //   {
  //     url: 'https://www.breitling.com/us-en/watches/navitimer/navitimer-automatic-35/A17395161C1/?watch=A17395161C1P1',
  //     collection: 'NAVITIMER-AUTOMATIC-35',
  //     name: 'A17395161C1',
  //     reference: 'A17395161C1P1'
  //   },
  //   {
  //     url: 'https://www.breitling.com/us-en/watches/navitimer/navitimer-automatic-35/A17395211A1/',
  //     collection: 'NAVITIMER-AUTOMATIC-35',
  //     name: 'A17395211A1',
  //     reference: 'A17395211A1'
  //   },
  //   {
  //     url: 'https://www.breitling.com/us-en/watches/navitimer/navitimer-automatic-35/R17395211A1/',
  //     collection: 'NAVITIMER-AUTOMATIC-35',
  //     name: 'R17395211A1',
  //     reference: 'R17395211A1'
  //   },
  //   {
  //     url: 'https://www.breitling.com/us-en/watches/navitimer/navitimer-automatic-35/A17395211A1/?watch=A17395211A1P1',
  //     collection: 'NAVITIMER-AUTOMATIC-35',
  //     name: 'A17395211A1',
  //     reference: 'A17395211A1P1'
  //   },
  //   {
  //     url: 'https://www.breitling.com/us-en/watches/navitimer/navitimer-automatic-35/R17395211A1/?watch=R17395211A1P2',
  //     collection: 'NAVITIMER-AUTOMATIC-35',
  //     name: 'R17395211A1',
  //     reference: 'R17395211A1P2'
  //   },
  //   {
  //     url: 'https://www.breitling.com/us-en/watches/navitimer/navitimer-automatic-35/U17395211A1/?watch=U17395211A1P1',
  //     collection: 'NAVITIMER-AUTOMATIC-35',
  //     name: 'U17395211A1',
  //     reference: 'U17395211A1P1'
  //   },
  //   {
  //     url: 'https://www.breitling.com/us-en/watches/navitimer/navitimer-automatic-35/A17395201K1/?watch=A17395201K1P2',
  //     collection: 'NAVITIMER-AUTOMATIC-35',
  //     name: 'A17395201K1',
  //     reference: 'A17395201K1P2'
  //   }
  // ];

  for (let i = 0; i < result.length; i++) {
    console.log(result.length, i)
    const ex = await extraction({
      client: axios,
      source: "official",
      lang: "en",
      brand: "Breitling",
      brandID: 118,
      ...result[i],
    });
    console.log(ex.spec);
  }
})();
//