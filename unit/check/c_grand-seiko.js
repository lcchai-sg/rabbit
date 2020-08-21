const cheerio = require('cheerio');
const client = require('axios');

const baseImageUrl = "https://storage.grand-seiko.com/production-b/uploads";
const CATEGORY_MAP = {
  2248: "watch",
  2255: "Elegance Collection",
  2256: "Heritage Collection",
  2257: "Sport Collection"
};

const LOCALE_MAP = {
  'en': 14,
  // 'jp': 2
};

const indexing = async (context) => {
  try {
    const { endpoint, base } = context;
    const indexing = {
      target: 'collection',
      payload: {
        collections: [
          "Elegance Collection",
          "Heritage Collection",
          "Sport Collection"
        ], items: {
          "Elegance Collection": [],
          "Heritage Collection": [],
          "Sport Collection": []
        }
      }
    };
    const extract = {
      target: "scrape.data.raw",
      payload: []
    };
    let page = 1;
    const products = await client.get(
      endpoint, {
      params: {
        category_id: 2248,
        locale_id: LOCALE_MAP['en'],
        page: page++,
        paginate: true,
        sort: '-publish_date',
        unit: 18
      }
    }
    );

    products.data.results.map(product => {
      let catId = product.category_ids.filter(id => id !== 2248)[0];
      const idx = {
        reference: product.title,
        name: product.title,
        url: base + product.slug,
        collection: CATEGORY_MAP[catId],
        thumbnail: baseImageUrl + product.thumbnail.url_key + "_jpg.jpg",
        retail: product.acf_values.product_price
      };
      const detail = {
        reference: product.title,
        source: 'official',
        rawData: product
      };
      indexing.payload.items[CATEGORY_MAP[catId]].push(idx);
      extract.payload.push(detail);
    })
    return indexing.payload;
  } catch (error) {
    console.log('Failed for indexing class of Grand Seiko ' +
      ' with error : ' + error
    )
    return [];
  }
};

const extraction = async (context) => {
  try {
    console.log('extraction>', context)
    const { url: entry, base, retail } = context;
    const result = {
      url: entry,
      spec: [],
      scripts: [],
      related: []
    };
    const $ = cheerio.load((await client.get(entry)).data);
    const name = $('.product-top-header h1').text().trim() + ' ' + $('.product-top-movement').text().trim();
    const reference = $('h1.product-top-item').text().trim();
    const currency = $('.product-top-price  span').text().trim();
    const description = $('.product-outline.product-tab-content').text().trim();
    const collection = $('.product-top-movement').text().trim().replace("[", "").replace("]", "");
    result.name = name;
    result.reference = reference;
    result.description = description.replace("FEATURES", "");
    result.retail = currency + ' ' + retail;
    result.collection = collection;
    result.thumbnail = $('.okra-carousel-slide-inner img').attr('src');
    if (description.toLocaleLowerCase().indexOf('woman') === 1) {
      result.gender = 'F'
    } else {
      result.gender = 'M';
    }
    $('.product-spec-inner tr').each((idx, el) => {
      const key = $(el).find('th').text().replace(":", "");
      const value = $(el).find('td ').text();
      result.spec.push({ key, value });
    });
    $('.posts-list-content.swiper-container ul li div a').each((idx, el) => {
      const ref = $(el).find('.posts-list-name').text();
      result.related.push(ref);
    });
    return result;
  }
  catch (error) {
    console.log('Failed for extraction class of Grand Seiko ' +
      ' with error : ' + error
    )
    return [];
  }
}

(async () => {
  const context = {
    entry: "https://www.grand-seiko.com/us-en/collections/",
    base: "https://www.grand-seiko.com/us-en/collections/",
    endpoint: "https://www.grand-seiko.com/__api/posts/list",
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
