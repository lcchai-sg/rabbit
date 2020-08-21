const cheerio = require('cheerio');
const client = require('axios');

const indexing = async (context) => {
  try {
    const { base, entry } = context;
    const result = { collections: [], items: {} };
    const cats = [
      {
        name: 'Men',
        url: 'https://www.gucci.com/us/en/ca/jewelry-watches/watches/watches-for-men-c-jewelry-watches-watches-men'
      },
      {
        name: 'Women',
        url: 'https://www.gucci.com/us/en/ca/jewelry-watches/watches/watches-for-women-c-jewelry-watches-watches-women'
      }
    ]
    for (const cat of cats) {
      result.collections.push(cat.name);
      result.items[cat.name] = [];
      const $ = cheerio.load((await client.get(cat.url)).data);
      $('.product-tiles-grid-item.product-tiles-grid-item-medium.product-tiles-grid-item-small ').each((idx, el) => {
        const url = base + $(el).find('a').attr('href');
        const name = $(el).find('.product-tiles-grid-item-info h2').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
        const thumbnail = 'https:' + $(el).find('.carousel-image-wrapper img').attr('src');
        const retail = $(el).find('.price').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
        const reference = $(el).find('a').attr('id');
        result.items[cat.name].push({
          url,
          thumbnail,
          collection: cat.name,
          name,
          retail,
          reference
        })
      });

    }
    return result;
  }
  catch (error) {
    console.log('Failed for indexing class of Gucci ' +
      ' with error : ' + error
    )
    return [];
  }
};

const extraction = async (context) => {
  try {
    const { url: entry, base } = context;
    const result = {
      url: entry,
      scripts: [],
      spec: [],
      related: []
    };
    const $ = cheerio.load((await client.get(entry)).data);
    result.name = $('.productnameandprice-container-standard h1').text().trim() ? $('.productnameandprice-container-standard h1').text().trim() : '';
    result.retail = $('.price-column.product-detail-price-column').text().split(/\r?\n/)[1].trim() ? $('.price-column.product-detail-price-column').text().split(/\r?\n/)[1].trim() : '';
    result.reference = $('.style-number-title ').text().trim() ? $('.style-number-title ').text().replace('Style', '').trim() : '';
    result.description = $('.product-detail p').text().trim() ? $('.product-detail p').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim() : '';
    if (entry.match(/watches-for-men/i)) {
      result.gender = 'M';
    }
    else {
      result.gender = 'F';
    }
    $('.product-detail li').each((idx, el) => {
      let pp = false;
      const value = $(el).text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
      let key = '';
      if (value.match(/case/i)) {
        pp = true;
        key = 'Case';
        result.spec.push({ key, value });
      }
      if (value.match(/movement/i)) {
        pp = true;
        key = 'Movement';
        result.spec.push({ key, value });
      }
      if (value.match(/water/i)) {
        pp = true;
        key = 'Water Resistance';
        result.spec.push({ key, value });
      }
      if (value.indexOf("YA") > -1) {
        pp = true;
        key = 'Calibre';
        result.spec.push({ key, value });
      }
      if (!pp) {
        key = 'Details';
        result.spec.push({ key, value });
      }
    });
    return result;
  }
  catch (error) {
    console.log('Failed for extraction class of Gucci ' +
      ' with error : ' + error
    )
    return [];
  }
};

(async () => {
  const context = {
    entry: "https://www.gucci.com/",
    base: "https://www.gucci.com/",
  };
  const r = await indexing(context);
  console.log(r)
  if (r && r.items && r.collections) {
    const context = r.items[r.collections[0]][0];
    const e = await extraction(context);
    if (e.spec && e.spec.length > 0) {
      console.log(e)
    } else {
      console.log('extraction failed...')
    }
  } else {
    console.log('indexing failed...')
  }
})();
