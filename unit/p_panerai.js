const axios = require('axios');

(async () => {
  const brandID = 58;
  const brand = "Panerai";
  const source = "official";
  const lang = "en";
  const base = "https://www.panerai.com";
  const entry = "https://www.panerai.com/en/collections/watch-collection/submersible.product-filter.SG.json";

  const urls = [
    "https://www.panerai.com/en/collections/watch-collection/submersible.product-filter.SG.json",
    "https://www.panerai.com/en/collections/watch-collection/luminor.product-filter.SG.json",
    "https://www.panerai.com/en/collections/watch-collection/luminor-due.product-filter.SG.json",
    "https://www.panerai.com/en/collections/watch-collection/radiomir.product-filter.SG.json"
  ]
  
  try {
    for (const i in urls) {
      json = (await axios.get(urls[i])).data;
      for (const j in json) {
        let reference = json[j]['reference'];
        let name = json[j]['name'];
        let thumbnail = base + json[j]['imagePath'];
        let collection = json[j]['productCollection'];
        let price = json[j]['formattedPrice'];
        let url = base + json[j]['productPageUrl'].split('/content/pan/ww/global')[1]+'.html';
        let productId = null;
        console.log({
          brandID,
          brand,
          source,
          lang,
          collection,
          name,
          reference,
          price,
          url,
          thumbnail,
          productId,
        })
      }
    }
    process.exit(0);
  } catch (error) {
    console.log("*** error ***");
    console.log(error);
    process.exit(1);
  }
})();