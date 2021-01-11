const axios = require('axios');
const cheerio = require('cheerio');

const indexing = async (context) => {
  const { client, entry, base, } = context;
  const result = { collections: [], items: {} };
  const uniq = [];
  try {
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
      let cnt = 0;
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
        if (uniq.indexOf(url) < 0) uniq.push(url);
        cnt++;
      });
      console.log(cat.name, cnt);
    }
    console.log(uniq.length)
    console.log()
    return result;
  } catch (error) {
    console.log('Failed indexing for Gucci with error : ' + error);
    return {};
  }
};

const newIndexing = async (context) => {
  const { client, entry, base, } = context;
  const result = { collections: [], items: {} };
  try {
    let link = entry;
    let page = 0;
    do {
      let cnt = 0;
      console.log(link);
      const $ = cheerio.load((await client.get(link)).data);
      $('.product-tiles-grid-item.product-tiles-grid-item-medium.product-tiles-grid-item-small ').each((idx, el) => {
        const url = base + $(el).find('a').attr('href');
        const name = $(el).find('.product-tiles-grid-item-info h2').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
        const thumbnail = 'https:' + $(el).find('.carousel-image-wrapper img').attr('src');
        const retail = $(el).find('.price').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
        const reference = $(el).find('a').attr('id');
        const col = url.split('/');
        const collection = col[col.length - 1].split('-watch-')[0].replace(new RegExp('-', 'g'), ' ').toUpperCase();
        if (result.collections.indexOf(collection) < 0) {
          result.collections.push(collection);
          result.items[collection] = [];
        }
        result.items[collection].push({
          url, collection, name, reference, thumbnail, retail,
        });
        cnt++
      });
      if (cnt >= 36) {
        page++;
        link = entry + page;
      } else link = null;
    } while (link);
    return result;
  } catch (error) {
    console.log('Failed indexing for Gucci with error : ' + error);
    return {};
  }
};

const extraction = async (context) => {
  const { client, entry, base, ...rest } = context;
  const result = { ...rest, url: entry, spec: [], related: [], features: [] };
  try {
    const $ = cheerio.load((await client.get(entry)).data);
    result.name = $('.productnameandprice-container-standard h1').text().trim() ? $('.productnameandprice-container-standard h1').text().trim() : '';
    result.retail = $('.price-column.product-detail-price-column').text().split(/\r?\n/)[1].trim() ? $('.price-column.product-detail-price-column').text().split(/\r?\n/)[1].trim() : '';
    result.reference = $('.style-number-title ').text().trim() ? $('.style-number-title ').text().replace('Style', '').trim() : '';
    result.description = $('.product-detail p').text().trim() ? $('.product-detail p').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim() : '';
    result.gender = entry.match(/watches-for-men/i) ? 'M' : 'F';
    $('.product-detail li').each((idx, el) => {
      let pp = false;
      const value = $(el).text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
      if (value.match(/case/i)) {
        pp = true;
        result.spec.push({ key: 'case', value });
      }
      if (value.match(/movement/i)) {
        pp = true;
        result.spec.push({ key: 'movement', value });
      }
      if (value.match(/water/i)) {
        pp = true;
        result.spec.push({ key: 'water resistance', value });
      }
      if (value.indexOf("YA") > -1) {
        pp = true;
        result.spec.push({ key: 'calibre', value });
      }
      if (!pp) {
        result.spec.push({ key: 'details', value });
      }
    });
  } catch (error) {
    console.log('Failed extraction for Gucci with error : ' + error);
    result.code = error.response.status;
  }
  return result;
};


(async () => {
  const r = await newIndexing({
    client: axios,
    entry: "https://www.gucci.com/us/en/ca/jewelry-watches/watches-c-jewelry-watches-watches/",
    brandID: 156,
    brand: "Gucci",
    base: "https://www.gucci.com/",
  });
  //   const r = await indexing({
  //     client: axios,
  //     entry: "https://www.gucci.com/",
  //     brandID: 156,
  //     brand: "Gucci",
  //     base: "https://www.gucci.com/",
  //   });
  // console.log(r);
  r.collections && r.collections.forEach(c => {
    r.items[c].forEach(w => {
      console.log(w);
    })
  })

  // const rr = r ? r.items[r.collections[0]] : [];
  // const rr = [
  //   "",
  //   "",
  // ];

  // for (let i = 0; i < rr.length; i++) {
  //   const ex = await extraction({
  //     // entry: rr[i],
  //     entry: rr[i].url,
  //     client: axios,
  //     brand: "Gucci",
  //     brandID: 156,
  //     base: "https://www.gucci.com/",
  //   })
  //   console.log(ex);
  // }
})();