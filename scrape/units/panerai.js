const axios = require('axios');

const scrapeResult = async (market = 'SGP') => {
  const brandId = 58;
  const type = 'OFFICIAL';
  const price = 0;
  const tax = 0;
  const sourceId = 1;
  let currencyId;
  let urls;
  switch (market) {
    case 'SGP':
      urls = [
        "https://www.panerai.com/en/collections/watch-collection/submersible.product-filter.SG.json",
        "https://www.panerai.com/en/collections/watch-collection/luminor.product-filter.SG.json",
        "https://www.panerai.com/en/collections/watch-collection/luminor-due.product-filter.SG.json",
        "https://www.panerai.com/en/collections/watch-collection/radiomir.product-filter.SG.json"
      ];
      currencyId = 11;
      break;
    case 'HKG':
      urls = [
        "https://www.panerai.com/en/collections/watch-collection/submersible.product-filter.HK.json",
        "https://www.panerai.com/en/collections/watch-collection/luminor.product-filter.HK.json",
        "https://www.panerai.com/en/collections/watch-collection/luminor-due.product-filter.HK.json",
        "https://www.panerai.com/en/collections/watch-collection/radiomir.product-filter.HK.json"
      ];
      currencyId = 1;
      break;
    case 'JPN':
      urls = [
        "https://www.panerai.com/en/collections/watch-collection/submersible.product-filter.JP.json",
        "https://www.panerai.com/en/collections/watch-collection/luminor.product-filter.JP.json",
        "https://www.panerai.com/en/collections/watch-collection/luminor-due.product-filter.JP.json",
        "https://www.panerai.com/en/collections/watch-collection/radiomir.product-filter.JP.json"
      ];
      currencyId = 7;
      break;
    case 'CHN':
      urls = [
        "https://www.panerai.com/en/collections/watch-collection/submersible.product-filter.CN.json",
        "https://www.panerai.com/en/collections/watch-collection/luminor.product-filter.CN.json",
        "https://www.panerai.com/en/collections/watch-collection/luminor-due.product-filter.CN.json",
        "https://www.panerai.com/en/collections/watch-collection/radiomir.product-filter.CN.json"
      ];
      currencyId = 20;
      break;
    case 'USA':
    default:
      urls = [
        "https://www.panerai.com/en/collections/watch-collection/submersible.product-filter.US.json",
        "https://www.panerai.com/en/collections/watch-collection/luminor.product-filter.US.json",
        "https://www.panerai.com/en/collections/watch-collection/luminor-due.product-filter.US.json",
        "https://www.panerai.com/en/collections/watch-collection/radiomir.product-filter.US.json"
      ];
      currencyId = 2;
      break;
  }
  let result = [];
  
  try {
    for (const i in urls) {
      const json = (await axios.get(urls[i])).data;
      for (const j in json) {
        let reference = json[j]['reference'];
        let amount = json[j]['formattedPrice'].split('$')[1];
        amount = amount ? parseFloat(amount.replace(',','')) : 0;
        result.push({
          sourceId,
          type,
          market,
          brandId,
          reference,
          currencyId,
          price,
          tax,
          amount,
        })
      }
    }
    return result;
  } catch (error) {
    console.log("Scraper for Appraise official price reference - ERROR");
    console.log(error);
    logger.error(error);
    return [];
  }
}

module.exports = scrapeResult;