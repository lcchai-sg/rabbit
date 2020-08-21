const client = require('axios');
const cheerio = require('cheerio');

const priceURL = "https://www.iwc.com/us/en/watches.pricedetails.US.json";

const indexing = async (context) => {
  try {
    const { entry, base } = context;
    const result = { collections: [], items: {} };
    const $ = cheerio.load((await client.get(entry)).data);
    const allProducts = [];
    const collections = $(".iwc-finder-result-collection");
    const items = {};
    const collectionTitles = [];

    collections.each((i, collection) => {
      const collectionTitle = $(collection).find("h3").text().trim();
      collectionTitles.push(collectionTitle);
      items[collectionTitle] = [];
      const subCollections = $(collection).find(".iwc-finder-result-subcollection");
      if (subCollections.length == 0) {
        // no sub categories
        const products = $(collection).find(".iwc-finder-result-product");
        result.collections.push({ collection: collectionTitle, subCollection: collectionTitle })
        processProducts($, products, base, collectionTitle, null).forEach(product => items[collectionTitle].push(product));
      } else {
        // has sub categories
        subCollections.each((_, subCollection) => {
          const subCollectionTitle = $(subCollection).find("h4").text().trim();
          const products = $(subCollection).find(".iwc-finder-result-product");
          items[subCollectionTitle] = [];
          result.collections.push({ collection: collectionTitle, subCollection: subCollectionTitle })
          processProducts($, products, base, collectionTitle, subCollectionTitle).forEach(product => items[subCollectionTitle].push(product));
        });
      }
    })
    const prices = (await client.get(priceURL)).data;
    for (const product in allProducts) {
      allProducts[product].price = prices.values[allProducts[product].ref];
    }
    result.items = items;
    return result;
  }
  catch (error) {
    const { brand, brandID } = context;
    console.log('Failed for indexing class of IWC ' +
      ' with error : ' + error
    )
    return [];
  }
}

const processProducts = ($, products, base, collectionTitle, subCollectionTitle) => {
  const baseUrl = 'https://www.iwc.com';
  let allProductsInSubCollection = [];
  products.each((_, product) => {
    const url = baseUrl + $(product).find(".iwc-finder-result-product > a").attr('href');
    const name = $(product).find(".iwc-finder-product-title").text().trim();
    const thumbnail = baseUrl + $(product).find("img")[0].attribs["data-src"];
    const reference = $(product).find(".iwc-finder-product-ref").text().trim();
    const retail = $(product).find(".iwc-product-fromprice").text().trim();

    allProductsInSubCollection.push({
      collection: collectionTitle,
      subCollection: subCollectionTitle || null,
      url,
      name,
      reference,
      thumbnail,
      retail,
    })
  });
  return allProductsInSubCollection;
}

const extraction = async (context) => {
  try {
    const { url: entry, base, retail } = context;
    const result = {
      url: entry,
      scripts: [],
      spec: [],
      related: []
    };
    const $ = cheerio.load((await client.get(entry)).data);
    const reference = $('.iwc-buying-options-reference').text().trim();
    $("#iwc-features > div > div:nth-child(1) > ul li.iwc-product-detail-item").each((idx, elem) => {
      const caseDetail = $(elem).text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
      result.spec.push({ key: 'case', value: caseDetail });
    });
    $("#iwc-features > div > div:nth-child(2) > ul li.iwc-product-detail-item").each((idx, elem) => {
      const movement = $(elem).text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
      result.spec.push({ key: 'movement', value: movement });
    });
    $("#iwc-features > div > div:nth-child(3) > ul li.iwc-product-detail-item").each((idx, elem) => {
      const feature = $(elem).text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
      result.spec.push({ key: 'feature', value: feature });
    });
    $("#iwc-features > div > div:nth-child(4) > ul li.iwc-product-detail-item").each((idx, elem) => {
      const dial = $(elem).text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
      result.spec.push({ key: 'dial', value: dial });
    });
    $("#iwc-features > div > div:nth-child(5) > ul li.iwc-product-detail-item").each((idx, elem) => {
      const strap = $(elem).text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
      result.spec.push({ key: 'strap', value: strap });
    });
    result.name = $('.iwc-buying-options-title').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").replace('Add to my wishlist', '').trim();
    result.retail = retail;
    result.reference = reference;
    result.gender = 'M';
    return result;
  } catch (error) {
    console.log('Failed for extraction class of IWC ' +
      ' with error : ' + error
    )
    return [];
  }
};

(async () => {
  const context = {
    entry: "https://www.iwc.com/us/en/watches.html",
    base: "https://www.iwc.com",
  };
  const r = await indexing(context);
  console.log(r)
  if (r && r.items && r.collections) {
    const context = r.items[r.collections[0]['subCollection']][0];
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
