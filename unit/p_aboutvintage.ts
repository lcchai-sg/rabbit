const cheerio = require('cheerio');
const axios = require('axios');
const { MongoClient } = require('mongodb');

(async function () {
  try {
    const base = "https://aboutvintage.com";
    const entry = "https://aboutvintage.com/collections/all-watches";
    //let result = { source: 'official', brand: "About Vintage", brandID: 152, collections: [], items: {} };
    const db_url = `mongodb+srv://root:sysadmin@cluster0-jrvjy.mongodb.net/synopsis?retryWrites=true&w=majority`;
    const conn = await MongoClient.connect(db_url, { useUnifiedTopology: true });
    const db = conn.db("synopsis");
    const coll = db.collection("reference_pricing");

    let results = [];
    const $ = cheerio.load((await axios.get(entry)).data);
    console.log($)
    //$('.grid__item.grid-product.small--one-half.medium-up--one-quarter.aos-init.aos-animate').each((idx, el) => {
    $('.grid-product__content').each((idx, el) => {
      const url = base + $(el).find('.grid-product__link').attr('href');
      const thumbnail = 'https:' + $(el).find('.image-wrap img').attr('data-src').replace('{width}', '400');
      // const name = $(el).find('.image-wrap img').attr('alt');
      const name = $(el).find('.grid-product__title').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
      const retail = $(el).find('.grid-product__price').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
      const collection = name.split(',')[0];

      results.push({
        source: 'official',
        url,
        thumbnail,
        collection,
        lang: "en",
        name,
        retail,
        brand: "About Vintage",
        brandID: 152,
        productID: null,
        reference: null,
      });
    }); //$
    // console.log("***** result *****")
    // console.log(results)
    // console.log("***** total products: ", results.length)

    for (i=0; i<results.length; i++) {
      const {reference, lang, url, brandID, ...rest} = results[i];

      await coll.findOneAndUpdate(
        {reference, lang, url, brandID},
        {$set: rest},
        {upsert: true}
      )
    }

    process.exit(0)
  } catch (error) {
    console.log("***** error *****");
    console.log(error);
    process.exit(1)
  }
})();
