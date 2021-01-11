const axios = require('axios');

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
    const { client, endpoint, brand, brandID, lang, base } = context;
    const indexing = {
      target: 'collection',
      payload: {
        brand, brandID,
        source: 'official',
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
    let total = 0;
    let count;
    let page = 1;
    do {
      count = 0;
      const products = await client.get(
        endpoint, {
        params: {
          category_id: 2248,
          locale_id: LOCALE_MAP[lang],
          page: page++,
          paginate: true,
          sort: '-publish_date',
          unit: 18
        }
      }
      );
      console.log(products)
      products.data.results.map(product => {
        let catId = product.category_ids.filter(id => id !== 2248)[0];
        const idx = {
          source: 'official',
          lang,
          reference: product.title,
          name: product.title,
          url: base + product.slug,
          collection: CATEGORY_MAP[catId],
          thumbnail: baseImageUrl + product.thumbnail.url_key + "_jpg.jpg",
          retail: product.acf_values.product_price
        };
        const detail = {
          brand,
          brandID,
          lang,
          reference: product.title,
          source: 'official',
          rawData: product
        };
        indexing.payload.items[CATEGORY_MAP[catId]].push(idx);
        extract.payload.push(detail);
        count++;
        total++;
      })
    } while (!(count < 18));
    return indexing.payload;
  } catch (error) {
    console.log('Failed indexing for Grand-Seiko with error : ' + error);
    return {};
  }
};

(async () => {
  const r = await indexing({
    client: axios,
    endpoint: "https://www.grand-seiko.com/__api/posts/list",
    brand: "grand-seiko",
    brandID: 84,
    lang: "en",
    base: "https://www.grand-seiko.com/us-en/collections/",
  });
  console.log(r);
})();