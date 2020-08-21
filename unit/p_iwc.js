const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const { MongoClient } = require('mongodb');

(async () => {
  const db_url = `mongodb+srv://root:sysadmin@cluster0-jrvjy.mongodb.net/synopsis?retryWrites=true&w=majority`;
  const conn = await MongoClient.connect(db_url, { useUnifiedTopology: true });
  const db = conn.db("synopsis");
  const coll = db.collection("reference_pricing");

  const processProducts = ($, products, base, collectionTitle, subCollectionTitle = null) => {
    const baseUrl = 'https://www.iwc.com';
    const lang = 'en';
    let allProductsInSubCollection = [];
    products.each((_, product) => {
      const url = baseUrl + $(product).find(".iwc-finder-result-product > a").attr('href');
      const name = $(product).find(".iwc-finder-product-title").text().trim();
      const thumbnail = baseUrl + $(product).find("img")[0].attribs["data-src"];
      const reference = $(product).find(".iwc-finder-product-ref").text().trim();
      const retail = $(product).find(".iwc-product-fromprice").text().trim();

      results.push({
        source: 'official',
        collection: collectionTitle,
        subCollection: subCollectionTitle,
        url,
        name,
        reference,
        thumbnail,
        retail,
        lang,
        brand,
        brandID,
        productID: null,
      })
    }); //products.each
  } //const

  const base = "https://www.iwc.com"
  const entry = "https://www.iwc.com/us/en/watches.html";

  const lang = "en";
  const brand = "IWC";
  const brandID = 4;
  const productID = null;
  let results = [];

  const browser = await puppeteer.launch();

  try {
    const page = await browser.newPage();
    await page.goto(entry);
    const data = await page.evaluate(() => document.body.innerHTML);
    const $ = cheerio.load(data);

    $(".iwc-finder-result-collection").each((i, collection) => {
      let collectionTitle = $(collection).find("h3").text().trim();
      let subCollections = $(collection).find(".iwc-finder-result-subcollection");
      if (!(subCollections.length == 0)) {
        subCollections.each((_, subCollection) => {
          let subCollectionTitle = $(subCollection).find("h4").text().trim();
          const products = $(subCollection).find(".iwc-finder-result-product");
          processProducts($, products, base, collectionTitle, subCollectionTitle);
        })
      } else {
        const products = $(collection).find(".iwc-finder-result-product");
        processProducts($, products, base, collectionTitle);
      }
    })

    for (i=0; i<results.length; i++) {
      const {reference, lang, url, brandID, ...rest} = results[i];

      await coll.findOneAndUpdate(
        { reference, lang, url, brandID },
        { $set: rest },
        { upsert : true }
      );
    }

    browser.close();
    process.exit(0);
  } catch (error) {
    console.log(error)
    browser.close();
    process.exit(1);
  }
})();